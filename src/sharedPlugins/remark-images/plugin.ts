import { visit, SKIP, CONTINUE } from 'unist-util-visit';
import type { Plugin, Transformer } from 'unified';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx';
import { BlockContent, Image, Paragraph, Parent, PhrasingContent, Root, Text } from 'mdast';
import path from 'path';
import fs from 'fs';
import { cleanedText, parseOptions, toJsxAttribute } from '../helpers';

const DEFAULT_TAG_NAMES = {
    figure: 'figure',
    figcaption: 'figcaption',
    sourceRef: 'SourceRef'
};

export type CaptionVisitor = (captionAst: Parent, rawCaption: string) => void;

interface OptionsInput {
    tagNames?: {
        figure?: string;
        figcaption?: string;
        sourceRef?: string;
    };
    inlineEmptyCaptions?: boolean;
    captionVisitors?: CaptionVisitor[];
}

const SPACER_SPAN = {
    type: 'mdxJsxTextElement',
    name: 'span',
    attributes: [toJsxAttribute('style', { flexGrow: 1 })],
    children: []
} as MdxJsxTextElement;

const trimText = (nodes: PhrasingContent[], location: 'start' | 'end') => {
    const textNode = nodes[location === 'start' ? 0 : nodes.length - 1];
    if (textNode.type === 'text') {
        if (location === 'start') {
            textNode.value = textNode.value.trimStart();
        } else {
            textNode.value = textNode.value.trimEnd();
        }
    }
    return nodes;
};

const unshiftImagesFromParagraphs = (ast: Root) => {
    visit(ast, 'paragraph', (node, idx, parent) => {
        if (!parent || idx === undefined) {
            return;
        }
        const imageIndex = node.children.findIndex((n) => n.type === 'image');
        if (imageIndex >= 0) {
            const image = node.children.splice(imageIndex, 1)[0] as Image;
            if (/@inline/.test(image.alt || '')) {
                node.children.splice(imageIndex, 0, image);
                return CONTINUE;
            }
            if (node.children.length === 0) {
                parent.children.splice(idx, 1, image);
            } else if (imageIndex === 0) {
                /** was the first child */
                trimText(node.children, 'start');
                const first = node.children[0];
                if (first?.type === 'text' && first.value.length === 0) {
                    node.children.shift();
                }
                parent.children.splice(idx, 0, image as any as BlockContent);
            } else if (imageIndex === node.children.length) {
                /** was the last child */
                trimText(node.children, 'end');
                const last = node.children[node.children.length - 1];
                if (last?.type === 'text' && last.value.length === 0) {
                    node.children.pop();
                }
                parent.children.push(image as any as BlockContent);
            } else {
                const preChildren = node.children.splice(0, imageIndex);
                trimText(preChildren, 'end');
                const postChildren = node.children.slice();
                trimText(postChildren, 'start');
                let spliceTo = idx;
                if (preChildren.some((n) => n.type !== 'text' || n.value.length > 0)) {
                    parent.children.splice(spliceTo, 0, {
                        children: preChildren.filter((n) => n.type !== 'text' || n.value.length > 0),
                        type: 'paragraph'
                    });
                    spliceTo++;
                }
                parent.children.splice(spliceTo, 1, image);
                spliceTo++;
                if (postChildren.some((n) => n.type !== 'text' || n.value.length > 0)) {
                    parent.children.splice(spliceTo, 0, {
                        children: postChildren.filter((n) => n.type !== 'text' || n.value.length > 0),
                        type: 'paragraph'
                    });
                    spliceTo++;
                }
            }
        }
    });
};

const plugin: Plugin<OptionsInput[], Root> = function plugin(
    this,
    optionsInput = { tagNames: DEFAULT_TAG_NAMES }
): Transformer<Root> {
    return async (ast, vfile) => {
        const dir = path.dirname(vfile.history[0] || '');
        const bibPromises = [] as Promise<any>[];
        unshiftImagesFromParagraphs(ast);
        visit(ast, 'image', (node, idx, parent) => {
            if (!parent) {
                return;
            }
            const line = (node.position?.start?.line || 1) - 1;
            const raw = vfile.value
                .toString()
                .split('\n')
                [line].slice((node.position?.start?.column || 1) - 1, node.position?.end?.column || 0);
            const rawCaption = raw.slice(2).replace(`](${node.url})`, '');
            /** get image options and set cleaned alt text */
            const cleanedAlt = cleanedText(rawCaption || '');
            const options = parseOptions(rawCaption || '', true);
            const isInline = /@inline/.test(node.alt || '') && parent.type === 'paragraph';
            if (isInline) {
                node.alt = cleanedText(node.alt || '').replace(/@inline/, '');
                return SKIP;
            }
            node.alt = cleanedText(node.alt || '');
            const figure = {
                type: 'mdxJsxFlowElement',
                name: optionsInput?.tagNames?.figure || DEFAULT_TAG_NAMES.figure,
                attributes: Object.keys(options).length > 0 ? [toJsxAttribute('options', options)] : [],
                children: [node] as unknown as BlockContent[]
            } as MdxJsxFlowElement;

            /**
             * Add alt as caption
             */
            const caption = {
                type: 'mdxJsxTextElement',
                name: optionsInput?.tagNames?.figcaption || DEFAULT_TAG_NAMES.figcaption,
                attributes: [],
                children: []
            } as MdxJsxFlowElement | MdxJsxTextElement;

            const { inlineCaption = false } = options as any;
            const { inlineEmptyCaptions = true } = optionsInput;
            const captionEmpty = /^\s*$/.test(node.alt);
            if (inlineCaption || (captionEmpty && inlineEmptyCaptions)) {
                caption.attributes.push(toJsxAttribute('className', 'inline'));
            }

            if (cleanedAlt) {
                const altAst = this.parse(cleanedAlt) as Parent;
                if (optionsInput?.captionVisitors) {
                    optionsInput.captionVisitors.forEach((visitor) => visitor(altAst, cleanedAlt));
                }
                /* flatten paragraphs by only using their child nodes */
                const altNodes = altAst.children.flatMap((n) =>
                    n.type === 'paragraph' ? n.children : (n as PhrasingContent)
                );
                caption.children = [SPACER_SPAN, ...altNodes, SPACER_SPAN];
            }

            /**
             * Try to find a bib file with the same name as the image
             */
            const ext = path.extname(node.url);
            const bibFile = path.resolve(dir, node.url.replace(new RegExp(`${ext}$`), '.json'));
            const hasBibFile = fs.existsSync(bibFile);
            if (hasBibFile) {
                const bibPromise = import(bibFile)
                    .then(({ default: bib }) => {
                        const bibNode = {
                            type: 'mdxJsxTextElement',
                            name: optionsInput?.tagNames?.sourceRef || DEFAULT_TAG_NAMES.sourceRef,
                            attributes: [toJsxAttribute('bib', bib)],
                            children: []
                        } as MdxJsxTextElement;
                        if (!cleanedAlt) {
                            caption.children.splice(caption.children.length, 0, SPACER_SPAN);
                        }
                        caption.children.splice(caption.children.length, 0, bibNode);
                    })
                    .catch((err) => {
                        console.warn('Invalid bib file', bibFile, err);
                    });
                bibPromises.push(bibPromise);
            }
            if (caption.children.length > 0 || hasBibFile) {
                figure.children.splice(figure.children.length, 0, caption as BlockContent);
            }
            parent.children.splice(idx || 0, 1, figure);
        });
        await Promise.all(bibPromises);
    };
};

export default plugin;

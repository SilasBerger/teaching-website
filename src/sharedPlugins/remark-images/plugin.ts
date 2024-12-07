import { visit, SKIP } from 'unist-util-visit';
import type { Plugin, Transformer } from 'unified';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx';
import { BlockContent, Image, Parent, PhrasingContent, Root } from 'mdast';
import path from 'path';
import fs from 'fs';
import { cleanedText, parseOptions, toJsxAttribute } from '../helpers';

const DEFAULT_TAG_NAMES = {
    figure: 'figure',
    figcaption: 'figcaption',
    sourceRef: 'SourceRef'
};

interface OptionsInput {
    tagNames?: {
        figure?: string;
        figcaption?: string;
        sourceRef?: string;
    };
    vFile?: {
        history: string[];
    };
    inlineEmptyCaptions?: boolean;
}

const SPACER_SPAN = {
    type: 'mdxJsxTextElement',
    name: 'span',
    attributes: [toJsxAttribute('style', { flexGrow: 1 })],
    children: []
} as MdxJsxTextElement;

const plugin: Plugin<OptionsInput[], Root> = function plugin(
    this,
    optionsInput = { tagNames: DEFAULT_TAG_NAMES }
): Transformer<Root> {
    return async (ast, vfile) => {
        const dir = path.dirname(vfile.history[0] || optionsInput?.vFile?.history[0] || '');
        const bibPromises = [] as Promise<any>[];
        visit(ast, ['paragraph', 'image'], (node, idx, parent) => {
            if (!parent) {
                return;
            }
            if (node.type === 'paragraph') {
                const imagesOnly = node.children.every((n) => {
                    return n.type === 'image' || (n.type === 'text' && n.value.trim() === '');
                });
                if (imagesOnly) {
                    const imgs = node.children.filter((n) => n.type === 'image') as Image[];
                    parent.children.splice(idx || 0, 1, ...imgs);
                    return [SKIP, idx];
                }
            } else if (node.type === 'image') {
                const line = (node.position?.start?.line || 1) - 1;
                const raw = vfile.value
                    .toString()
                    .split('\n')
                    [line].slice((node.position?.start?.column || 1) - 1, node.position?.end?.column || 0);
                const rawCaption = raw.slice(2).replace(`](${node.url})`, '');
                /** get image options and set cleaned alt text */
                const cleanedAlt = cleanedText(rawCaption || '');
                const options = parseOptions(rawCaption || '', true);
                node.alt = cleanedText(node.alt || '');
                const jsxType = parent.type === 'paragraph' ? 'mdxJsxTextElement' : 'mdxJsxFlowElement';
                const figure = {
                    type: jsxType,
                    name: optionsInput?.tagNames?.figure || DEFAULT_TAG_NAMES.figure,
                    attributes: Object.keys(options).length > 0 ? [toJsxAttribute('options', options)] : [],
                    children: [node]
                } as MdxJsxFlowElement | MdxJsxTextElement;

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
            }
        });
        await Promise.all(bibPromises);
    };
};

export default plugin;

import { visit } from 'unist-util-visit';
import type { Plugin, Transformer } from 'unified';
import type { MdxJsxTextElement } from 'mdast-util-mdx';
import { Parent, Root } from 'mdast';

interface OptionsInput {
    tagName?: string;
    className?: string;
}

export const visitor = (
    ast: Root | Parent,
    source: string,
    config: { tagName?: string; className?: string }
) => {
    visit(ast, 'strong', (node, idx, parent) => {
        if (!parent || node.position === undefined || idx === undefined) {
            return;
        }
        const startOg = node.position.start.offset || 0;
        const endOg = node.position.end.offset;

        const strToOperateOn = source.substring(startOg, endOg);
        const wasUnderscored = strToOperateOn.startsWith('__') && strToOperateOn.endsWith('__');
        if (wasUnderscored) {
            parent.children.splice(idx, 1, {
                type: 'mdxJsxTextElement',
                name: config.tagName || 'strong',
                attributes: config.className
                    ? [{ type: 'mdxJsxAttribute', name: 'className', value: config.className }]
                    : [],
                children: node.children
            } as MdxJsxTextElement);
        }
    });
};

const plugin: Plugin<OptionsInput[], Root> = function plugin(optionsInput = {}): Transformer<Root> {
    return async (ast, vfile) => {
        const mdSource = vfile.value as string;
        visitor(ast, mdSource, { tagName: optionsInput.tagName, className: optionsInput.className });
    };
};

export default plugin;

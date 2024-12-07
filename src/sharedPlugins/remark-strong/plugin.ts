import { visit } from 'unist-util-visit';
import type { Plugin, Transformer } from 'unified';
import type { MdxJsxTextElement } from 'mdast-util-mdx';
import { Root } from 'mdast';

interface OptionsInput {
    tagName?: string;
    className?: string;
}

const plugin: Plugin<OptionsInput[], Root> = function plugin(optionsInput = {}): Transformer<Root> {
    const TAG_NAME = optionsInput?.tagName || 'strong';
    const CLASS_NAME = optionsInput?.className
        ? { type: 'mdxJsxAttribute', name: 'className', value: optionsInput.className }
        : undefined;
    return async (ast, vfile) => {
        const mdSource = vfile.value as string;
        visit(ast, 'strong', (node, idx, parent) => {
            if (!parent || node.position === undefined || idx === undefined) {
                return;
            }
            const startOg = node.position.start.offset || 0;
            const endOg = node.position.end.offset;

            const strToOperateOn = mdSource.substring(startOg, endOg);
            const wasUnderscored = strToOperateOn.startsWith('__') && strToOperateOn.endsWith('__');
            if (wasUnderscored) {
                parent.children.splice(idx, 1, {
                    type: 'mdxJsxTextElement',
                    name: TAG_NAME,
                    attributes: CLASS_NAME ? [CLASS_NAME] : [],
                    children: node.children
                } as MdxJsxTextElement);
            }
        });
    };
};

export default plugin;

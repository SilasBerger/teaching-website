import { visit } from 'unist-util-visit';
import type { Plugin, Processor, Transformer } from 'unified';
import type { MdxJsxTextElement } from 'mdast-util-mdx';
import { Parent, Strong } from 'mdast';

const plugin: Plugin = function plugin(
    this: Processor,
    optionsInput?: {
        tagName?: string;
        className?: string;
    }
): Transformer {
    const TAG_NAME = optionsInput?.tagName || 'strong';
    const CLASS_NAME = optionsInput?.className
        ? { type: 'mdxJsxAttribute', name: 'className', value: optionsInput.className }
        : undefined;
    return async (ast, vfile) => {
        const mdSource = vfile.value as string;
        visit(ast, 'strong', (node, idx, parent: Parent) => {
            const strong = node as Strong;
            const startOg = strong.position.start.offset;
            const endOg = strong.position.end.offset;

            const strToOperateOn = mdSource.substring(startOg, endOg);
            const wasUnderscored = strToOperateOn.startsWith('__') && strToOperateOn.endsWith('__');
            if (wasUnderscored) {
                parent.children.splice(idx, 1, {
                    type: 'mdxJsxTextElement',
                    name: TAG_NAME,
                    attributes: CLASS_NAME ? [CLASS_NAME] : [],
                    children: strong.children,
                    data: { _mdxExplicitJsx: true }
                } as MdxJsxTextElement);
            }
        });
    };
};

export default plugin;

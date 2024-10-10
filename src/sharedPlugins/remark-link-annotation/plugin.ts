import { visit, CONTINUE, SKIP } from 'unist-util-visit';
import type { Plugin, Processor, Transformer } from 'unified';
import type { MdxJsxTextElement } from 'mdast-util-mdx';
import { Link, Parent, Text } from 'mdast';
const plugin: Plugin = function plugin(
    this: Processor,
    optionsInput?: {
        prefix?: string | null;
        postfix?: string | null;
    }
): Transformer {
    const options = optionsInput || {};
    const prefix = options.prefix === undefined ? '👉' : options.prefix?.trim();
    const postfix = options.postfix?.trim() || null;

    return (tree) => {
        visit(tree, 'link', (node: Link, index, parent) => {
            if (prefix) {
                if (node.children.length < 1 || node.children[0].type !== 'text') {
                    node.children.unshift({ type: 'text', value: `${prefix} ` } as Text);
                } else if (node.children[0].type === 'text') {
                    if (!node.children[0].value.startsWith(prefix)) {
                        node.children[0].value = `${prefix} ${node.children[0].value}`;
                    }
                }
            }
            if (postfix) {
                const lastLinkPos = node.children.length - 1;
                if (lastLinkPos < 0 || node.children[lastLinkPos].type !== 'text') {
                    node.children.push({ type: 'text', value: ` ${postfix}` } as Text);
                } else if (node.children[lastLinkPos].type === 'text') {
                    if (!node.children[lastLinkPos].value.endsWith(postfix)) {
                        node.children[lastLinkPos].value = `${node.children[lastLinkPos].value} ${postfix}`;
                    }
                }
            }
        });
    };
};

export default plugin;

import type { Transformer } from 'unified';
import { Node, Parent } from 'unist';
import type { MdxJsxFlowElement } from 'mdast-util-mdx';
import { toJsxAttribute } from '../helpers';

/**
 * A remark plugin that adds a `<MdxPage /> elements at the top of the current page.
 * This is useful to initialize a page model on page load and to trigger side-effects on page display,
 * as to load models attached to the `page_id`'s root document.
 */
const plugin = function plugin(): Transformer {
    return async (root, file) => {
        const { visit, EXIT } = await import('unist-util-visit');
        const { page_id } = (file.data?.frontMatter || {}) as { page_id?: string };
        if (!page_id) {
            return;
        }
        visit(root, (node, index, parent: Node | undefined) => {
            /** add the MdxPage exactly once at the top of the document and exit */
            if (root === node && !parent) {
                const loaderNode: MdxJsxFlowElement = {
                    type: 'mdxJsxFlowElement',
                    name: 'MdxPage',
                    attributes: [toJsxAttribute('pageId', page_id)],
                    children: [],
                    data: {}
                };
                (node as Parent).children.splice(0, 0, loaderNode);
                return EXIT;
            }
        });
    };
};

export default plugin;

import {Transformer} from "unified";

import {Node, Parent} from "unist";
import {visit} from "unist-util-visit";
import {Directives} from "mdast-util-directive";


/** @type {import('unified').Plugin<[], MdastRoot>} */
export default function remarkTabs(): Transformer {
  return (mdast: Node) => {
    console.log(mdast);

    let tabsParent: Parent;
    let tabsNode: Directives;
    let endTabsNode: Directives;

    visit(
      mdast,
      (node) => node.type === 'textDirective' || node.type === 'leafDirective',
      (node: Directives, _, parent) => {
        const tag = node.name.toLowerCase();
        if (tag === 'tabs' || tag === 'endtabs') {
          if (tabsParent && parent !== tabsParent) {
            throw 'Unexpected tree: ::Tabs and ::EndTabs do not have the same parent.';
          }
          tabsParent = parent;
        }
        if (tag === 'tabs') {
          tabsNode = node;
        } else if (tag === 'endtabs') {
          endTabsNode = node;
        }
    });

    if (!(tabsNode && endTabsNode)) {
      return;
    }

    const tabsIndex = tabsParent.children.indexOf(tabsNode);
    const endTabsIndex = tabsParent.children.indexOf(endTabsNode);
    const tabsContentRoot: Parent = {
      type: 'root',
      children: [...tabsParent.children].slice(tabsIndex + 1, endTabsIndex)
    }
    console.log(tabsContentRoot);
  }
}

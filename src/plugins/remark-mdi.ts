import {Transformer} from "unified";
import {VFile} from "vfile";
import {Node, Literal, Parent} from "unist";
import {visit} from "unist-util-visit";

const MDI_PATTERN = /(?<before>[\s\S]*):(?<icon>mdi-[a-z-]+):(?<after>[\s\S]*)/;

/** @type {import('unified').Plugin<[], MdastRoot>} */
export default function remarkMdi(): Transformer {
  return (mdast: Node, _: VFile) => {
    visit(mdast, 'text', (node: Literal, _: number, parent: Parent) => {
      if (!node.value || typeof node.value !== 'string') {
        return;
      }

      const nodeLiteral: string = node.value;
      const mdiPatternMatch = nodeLiteral.match(MDI_PATTERN);
      if (!mdiPatternMatch) {
        return;
      }

      const replacementNodes = [
        {
          type: 'text',
          value: mdiPatternMatch.groups.before,
        },
        {
          type: 'mdxJsxTextElement',
          name: 'span',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'class',
              value: `mdi ${mdiPatternMatch.groups.icon}`
            }
          ],
          children: [],
          data: {_mdxExplicitJsx: true}
        },
        {
          type: 'text',
          value: mdiPatternMatch.groups.after,
        }
      ];

      const children = parent.children;
      const matchIndex = children.indexOf(node);
      children.splice(matchIndex, 1);
      children.splice(matchIndex, 0, ...replacementNodes);
    });
  };
};

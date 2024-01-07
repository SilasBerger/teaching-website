import {Transformer} from "unified";
import {VFile} from "vfile";
import {Parent} from "unist";
import {visit} from "unist-util-visit";
import {Directives} from "mdast-util-directive";
import {ensureEsmImports, ImportType} from "./util/mdast-esm-imports-util";

/** @type {import('unified').Plugin<[], MdastRoot>} */
export default function remarkFencedBlocks(): Transformer {
  return (mdast: Parent, _: VFile) => {
    let foundAdmonition = false;
    visit(mdast, 'containerDirective', (fenceRoot: Parent & Directives, _: number, parent: Parent) => {
      foundAdmonition = true;
      const fenceRootIndex = parent.children.indexOf(fenceRoot);
      (parent.children as any[])[fenceRootIndex] = {
        type: 'mdxJsxFlowElement',
        name: 'Admonition',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'type',
            value: fenceRoot.name,
          }
        ],
        children: fenceRoot.children,
        data: {_mdxExplicitJsx: true}
      }
    });

    if (foundAdmonition) {
      console.log(`Found admonitions, ensuring import.`);
      ensureEsmImports(mdast, [{
        sourcePackage: '@site/src/theme/Admonition',
        specifiers: [{type: ImportType.DEFAULT, name: 'Admonition'}],
      }]);
    }
  };
};

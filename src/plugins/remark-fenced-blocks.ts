import {Transformer} from "unified";
import {VFile} from "vfile";
import {Literal, Node, Parent} from "unist";
import {visit} from "unist-util-visit";
import {Directives} from "mdast-util-directive";

function ensureEsmNode(mdast: Parent): Literal {
  /*
  let esmNode: Literal;
  visit(mdast, 'mdxjsEsm', (node: Literal) => {
    esmNode = node;
  });

  if (!esmNode) {
    esmNode = {
      type: 'mdxjsEsm',
      value: ""
    }
    mdast.children = [esmNode, ...mdast.children];
  }

  return esmNode;

   */

  const esmNode = {
    type: 'mdxjsEsm',
    value: ""
  }
  mdast.children = [esmNode, ...mdast.children];
  return esmNode;
}

function ensureImports(mdast: Parent, requiredImportStrings: string[]) {
  const esmNode = ensureEsmNode(mdast);
  const imports = (esmNode.value as string)
    .split(';')
    .map(importString => importString.trim());

  requiredImportStrings
    .map(importString => importString.trim())
    .filter(importString => !!importString)
    .map(importString => importString.replace(';', ''))
    .filter(importString => !imports.includes(importString))
    .forEach(importString => imports.push(importString));

  esmNode.value = imports
    .map(importString => `${importString};`)
    .join('\n');
}

function ensureAdmonitionsImport(mdast: Parent) {
  // ensureImports(mdast, [`import Admonition from "@site/src/theme/Admonition"`]);
  const esmNode = ensureEsmNode(mdast);
  // esmNode.value = `import Admonition from "@site/src/theme/Admonition";`;
  esmNode.data = {
    estree: {
      type: 'Program',
      sourceType: 'module',
      body: [
        {
          type: 'ImportDeclaration',
          specifiers: [
            {
              type: 'ImportDefaultSpecifier', // TODO: vs. ImportSpecifier
              imported: {type: 'Identifier', name: 'Admonition'},
              local: {type: 'Identifier', name: 'Admonition'},
            }
          ],
          source: {
            type: "Literal",
            value: "@site/src/theme/Admonition",
            // raw: "@site/src/theme/Admonition"
          }
        }
      ]
    }
  }
}

/** @type {import('unified').Plugin<[], MdastRoot>} */
export default function remarkFencedBlocks(): Transformer {
  return (mdast: Parent, file: VFile) => {
    if (file.data.contentTitle === 'Hero Image') {
      console.log(mdast);
      return;
    }

    if (file.data.contentTitle !== 'Admonitions') {
      return;
    }

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
      console.log('creating import');
      ensureAdmonitionsImport(mdast);
    } else {
      console.log('Not creating import');
    }

    console.log(mdast);
  };
};

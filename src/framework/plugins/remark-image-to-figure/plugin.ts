import {Transformer} from "unified";
import {VFile} from "vfile";
import {Node, Parent} from "unist";
import {visit} from "unist-util-visit";
import {Optional} from "../../util/optional";
import {MdxJsxAttribute} from "mdast-util-mdx-jsx";
import {JsxElementSpec, MdxJsxElement} from "../shared/models";
import {jsxFlowElementFrom} from "../shared/util/jsx-node-util";
import {replaceNode} from "../shared/util/mdast-util";

const ALT_ATTRIBUTE_PATTERN = /--(?<propName>\S*)=(?<propVal>\S*)(\s+|$)/g;

function parseAttributesFromAlt(altNode: Optional<MdxJsxAttribute>) {
  const result = [];

  if (altNode.isEmpty()) {
    return result;
  }

  const value = altNode.get().value as string;
  const pattern = new RegExp(ALT_ATTRIBUTE_PATTERN);
  let match = pattern.exec(value);
  while (match) {
    result.push({name: match.groups.propName, value: match.groups.propVal});
    match = pattern.exec(value);
  }

  return result;
}

/** @type {import('unified').Plugin<[LineDirectivesConfig], MdastRoot>} */
export default function remarkImageToFigure(): Transformer {
  return (mdast: Node, _: VFile) => {
    visit(
      mdast,
      (node: Node) => node.type === 'mdxJsxTextElement' && (node as any).name === 'img',
      (imageNode: MdxJsxElement, _: number, parent: Parent) => {
        const srcValue = imageNode.attributes
          .find((attr: MdxJsxAttribute) => attr.name === 'src')
          .value;
        const altNode = Optional.of((imageNode as any).attributes.find(attr => (attr as MdxJsxAttribute).name === 'alt'));

        const elementSpec: JsxElementSpec = {
          componentName: 'Figure',
          attributes: [
            {name: 'src', value: srcValue},
            ...parseAttributesFromAlt(altNode as Optional<MdxJsxAttribute>),
          ],
        };
        replaceNode(parent, imageNode, jsxFlowElementFrom(elementSpec));
      });
  };
}

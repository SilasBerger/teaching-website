import {Transformer} from "unified";
import {VFile} from "vfile";
import {Node, Parent} from "unist";
import {visit} from "unist-util-visit";
import {Optional} from "../../util/optional";
import {MdxJsxAttribute} from "mdast-util-mdx-jsx";
import {JsxAttributesSpec, JsxElementSpec, MdxJsxElement} from "../shared/models";
import {jsxFlowElementFrom} from "../shared/util/jsx-node-util";
import {replaceNode} from "../shared/util/mdast-util";

// TODO: Exclude matches containing &quot; in prop value.
const UNQUOTED_ATTRIBUTE_PATTERN = /--(?<propName>\S*)=(?<propVal>\S*)(\s+|$)/g;
const QUOTED_ATTRIBUTE_PATTERN = /--(?<propName>\S*)=&quot;(?<propVal>[^"]+)&quot;/g;

function collectUnquotedAttributes(altValue: string, attributes: JsxAttributesSpec[]) {
  const pattern = new RegExp(UNQUOTED_ATTRIBUTE_PATTERN);
  let match = pattern.exec(altValue);
  while (match) {
    console.log({altValue, unquotedMatch: match});
    attributes.push({name: match.groups.propName, value: match.groups.propVal});
    match = pattern.exec(altValue);
  }
}

function collectQuotedAttributes(altValue: string, attributes: JsxAttributesSpec[]) {
  const pattern = new RegExp(QUOTED_ATTRIBUTE_PATTERN);
  let match = pattern.exec(altValue);
  while (match) {
    console.log({altValue, quotedMatch: match});
    attributes.push({name: match.groups.propName, value: match.groups.propVal});
    match = pattern.exec(altValue);
  }
}

function parseAttributesFromAlt(altNode: Optional<MdxJsxAttribute>): JsxAttributesSpec[] {
  const attributes = [];

  if (altNode.isEmpty()) {
    return attributes;
  }

  const altValue = altNode.get().value as string;
  collectUnquotedAttributes(altValue, attributes);
  collectQuotedAttributes(altValue, attributes); // TODO: Currently needs to override false unquoted matches.

  return attributes;
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

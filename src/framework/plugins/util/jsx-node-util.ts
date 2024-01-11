import {JsxElementSpec} from "./models";
import {Node} from "unist";

export function createJsxNode(spec: JsxElementSpec, children?: Node[]): any {
  return {
    type: spec.jsxElementType,
    name: spec.componentName,
    attributes: spec.attributes.map(attr => {
      return {
        type: 'mdxJsxAttribute',
        name: attr.name,
        value: attr.value,
      }
    }),
    children: children ?? [],
    data: {_mdxExplicitJsx: true}
  }
}

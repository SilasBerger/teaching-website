import {JsxElementSpec, MdxJsxElement} from "../models";
import {BlockContent, DefinitionContent, PhrasingContent} from 'mdast';

export enum JsxElementType {
  FLOW = 'mdxJsxFlowElement',
  TEXT = 'mdxJsxTextElement',
}


export function jsxFlowElementFrom(spec: JsxElementSpec, children?: Node[]): MdxJsxElement {
  return createMdxJsxElement(JsxElementType.FLOW, spec, children);
}

export function jsxTextElementFrom(spec: JsxElementSpec, children?: Node[]): MdxJsxElement {
  return createMdxJsxElement(JsxElementType.TEXT, spec, children);
}

function createMdxJsxElement(elementType: JsxElementType, spec: JsxElementSpec, children?: Node[]): MdxJsxElement {
  return {
    type: elementType,
    name: spec.componentName,
    attributes: spec.attributes.map(attr => {
      return {
        type: 'mdxJsxAttribute',
        name: attr.name,
        value: attr.value,
      }
    }),
    children: children ?? [] as unknown,
    data: {_mdxExplicitJsx: true}
  } as MdxJsxElement;
}

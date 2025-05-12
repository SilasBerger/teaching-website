import { JsxElementSpec } from '../models';
import { PhrasingContent } from 'mdast';
import { MdxJsxTextElement, MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import { Node } from 'unist';

export function jsxFlowElementFrom(spec: JsxElementSpec, children?: Node[]): MdxJsxFlowElement {
    return {
        type: 'mdxJsxFlowElement',
        name: spec.componentName,
        attributes: mapJsxAttributes(spec),
        children: children ?? ([] as unknown),
        data: { _mdxExplicitJsx: true }
    } as MdxJsxFlowElement;
}

export function jsxTextElementFrom(spec: JsxElementSpec, children?: PhrasingContent[]): MdxJsxTextElement {
    return {
        type: 'mdxJsxTextElement',
        name: spec.componentName,
        attributes: mapJsxAttributes(spec),
        children: children ?? [],
        data: { _mdxExplicitJsx: true }
    };
}

function mapJsxAttributes(spec: JsxElementSpec): MdxJsxAttribute[] {
    return spec.attributes.map((attr) => {
        return {
            type: 'mdxJsxAttribute',
            name: attr.name,
            value: attr.value
        };
    });
}

import { MdxJsxAttribute } from 'mdast-util-mdx-jsx';
import { JsxAttributesSpec } from '../models';

/**
 * Filter attributes to only include entries where `value` is not `undefined`.
 *
 * @param attributes The MdxJsxAttribute attributes to filter
 */
export function definedAttributes(attributes: JsxAttributesSpec[]): JsxAttributesSpec[] {
    return attributes.filter((attribute) => attribute.value !== undefined);
}

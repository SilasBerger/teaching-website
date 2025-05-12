import { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx';

export type MdxJsxElement = MdxJsxFlowElement | MdxJsxTextElement;

export interface JsxElementSpec {
    componentName: string;
    attributes: JsxAttributesSpec[];
}

export interface JsxAttributesSpec {
    name: string;
    value: any;
}

/**
 * Type of this import: default (`import Foo from "./bar"`) or named (`import {Foo} from "./bar"`)
 */
export enum ImportType {
    /**
     * e.g. `import Foo from "./bar"`
     */
    DEFAULT_IMPORT = 'ImportDefaultSpecifier',
    /**
     * e.g. `import {Foo} from "./bar"`
     */
    NAMED_IMPORT = 'ImportSpecifier'
}

export interface EsmImportSpecifier {
    name: string;
    type: ImportType;
}

export interface EsmImport {
    sourcePackage: string;
    specifiers: EsmImportSpecifier[];
}

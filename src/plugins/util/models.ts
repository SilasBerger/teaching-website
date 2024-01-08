export enum JsxElementType {
  FLOW_ELEMENT = 'mdxJsxFlowElement',
  TEXT_ELEMENT = 'mdxJsxTextElement',
}

export interface JsxElementSpec {
  jsxElementType: JsxElementType;
  componentName: string;
  attributes: {name: string, value: string}[]
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
  NAMED_IMPORT = 'ImportSpecifier',
}

export interface EsmImportSpecifier {
  name: string,
  type: ImportType;
}

export interface EsmImport {
  sourcePackage: string,
  specifiers: EsmImportSpecifier[];
}

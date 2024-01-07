import {FencedBlockConfig, FencedBlocksConfig, JsxElementType} from "../plugins/remark-fenced-blocks";
import {ImportType} from "../plugins/util/mdast-util-esm-imports";

const admonitionsBlock: FencedBlockConfig = {
  namePattern: /danger|warning|(key|finding)|definition|insight|(info|note|tip)/,
  converter: (type: string, header: string) => {
    return {
      jsxElementType: JsxElementType.FLOW_ELEMENT,
      componentName: 'Admonition',
      attributes: [
        {name: 'type', value: type},
        {name: 'title', value: header},
      ],
    }
  },
  esmImports: [{
    sourcePackage: '@site/src/theme/Admonition',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'Admonition'}],
  }]
};

const captionBlock: FencedBlockConfig = {
  namePattern: /Caption/,
  converter: (type: string, header: string) => {
    return {
      jsxElementType: JsxElementType.FLOW_ELEMENT,
      componentName: 'Caption',
      attributes: [],
    }
  },
  esmImports: [{
    sourcePackage: '@site/src/components/Caption',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'Caption'}],
  }]
};

export const fencedBlocksConfig: FencedBlocksConfig = {
  blocks: [
    admonitionsBlock,
    captionBlock,
  ],
};

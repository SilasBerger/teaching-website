import {FencedBlockConfig, FencedBlocksConfig} from "../plugins/remark-fenced-blocks";
import {ImportType, JsxElementType} from "../plugins/util/models";

const admonitionsBlock: FencedBlockConfig = {
  keywords: ['danger', 'warning', 'key', 'finding', 'definition', 'insight', 'info', 'note', 'tip'],
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

const heroBlock: FencedBlockConfig = {
  keywords: ['Hero'],
  converter: (type: string, header: string) => {
    return {
      jsxElementType: JsxElementType.FLOW_ELEMENT,
      componentName: 'HeroContainer',
      attributes: [],
    }
  },
  esmImports: [{
    sourcePackage: '@site/src/app/components/HeroContainer',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'HeroContainer'}],
  }]
};

const captionBlock: FencedBlockConfig = {
  keywords: ['Caption'],
  converter: (type: string, header: string) => {
    return {
      jsxElementType: JsxElementType.FLOW_ELEMENT,
      componentName: 'Caption',
      attributes: [],
    }
  },
  esmImports: [{
    sourcePackage: '@site/src/app/components/Caption',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'Caption'}],
  }]
};

export const fencedBlocksConfig: FencedBlocksConfig = {
  blocks: [
    admonitionsBlock,
    heroBlock,
    captionBlock,
  ],
};

export function fencedBlocksDefinedKeywords() {
  return fencedBlocksConfig.blocks.flatMap(blockConfig => blockConfig.keywords);
}

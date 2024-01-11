import {SpecialLinksConfig, SpecialLinksConfigEntry} from "../plugins/remark-special-links";
import {ImportType, JsxElementType} from "../plugins/util/models";

const youTubeVideoLinks: SpecialLinksConfigEntry = {
  converter: (url: string) => {
    return {
      jsxElementType: JsxElementType.FLOW_ELEMENT,
      componentName: 'YouTubeVideo',
      attributes: [
        {name: 'videoUrl', value: url},
      ],
    }
  },
  esmImports: [{
    sourcePackage: '@site/src/app/components/YouTubeVideo',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'YouTubeVideo'}],
  }]
};

const seeCodeBadgeLinks: SpecialLinksConfigEntry = {
  converter: (url: string) => {
    return {
      jsxElementType: JsxElementType.TEXT_ELEMENT,
      componentName: 'SeeCodeBadge',
      attributes: [
        {name: 'url', value: url},
      ],
    }
  },
  esmImports: [{
    sourcePackage: '@site/src/app/components/SeeCodeBadge',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'SeeCodeBadge'}],
  }]
};

export const specialLinksConfig: SpecialLinksConfig = {
  delimiter: '@',
  markers: {
    'YouTubeVideo': youTubeVideoLinks,
    'SeeCode': seeCodeBadgeLinks,
  },
};

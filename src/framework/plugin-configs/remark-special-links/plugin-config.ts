import {SpecialLinksConfig, SpecialLinksConfigEntry} from "../../plugins/remark-special-links/plugin";
import {ImportType} from "../../plugins/shared/models";
import {jsxFlowElementFrom, jsxTextElementFrom} from "../../plugins/shared/util/jsx-node-util";

const youTubeVideoLinks: SpecialLinksConfigEntry = {
  converter: (url: string) => {
    return jsxFlowElementFrom({
      componentName: 'YouTubeVideo',
      attributes: [
        {name: 'videoUrl', value: url},
      ],
    });
  },
  esmImports: [{
    sourcePackage: '@site/src/app/components/YouTubeVideo',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'YouTubeVideo'}],
  }]
};

const seeCodeBadgeLinks: SpecialLinksConfigEntry = {
  converter: (url: string) => {
    return jsxTextElementFrom({
      componentName: 'SeeCodeBadge',
      attributes: [
        {name: 'url', value: url},
      ],
    });
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

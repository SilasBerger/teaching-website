import {Transformer} from "unified";
import {VFile} from "vfile";
import {Literal, Parent} from "unist";
import {visit} from "unist-util-visit";
import {Link} from "mdast";
import {EsmImport, JsxElementSpec} from "./util/models";
import {createJsxNode} from "./util/jsx-node-util";
import {ensureEsmImports} from "./util/mdast-util-esm-imports";
import {replaceNode} from "./util/mdast-util";

export interface SpecialLinksConfigEntry {
  converter: (url: string) => JsxElementSpec;
  esmImports: EsmImport[];
}

export type SpecialLinksConfig = {
  delimiter: string;
  markers: {
    [key: string]: SpecialLinksConfigEntry
  }
}

function findMatchingMarker(node: Parent, config: SpecialLinksConfig) {
  if (node.children?.length === 0) {
    return;
  }

  const potentialMarker = (node.children[0] as Literal).value as string;
  if (!potentialMarker.startsWith(config.delimiter)) {
    return;
  }

  const matchingConfig = Object.entries(config.markers)
    .find(([definedMarker, markerConfig]) => {
      return potentialMarker == `@${definedMarker}`
    });

  return matchingConfig ? matchingConfig[1] : undefined;
}

/** @type {import('unified').Plugin<[SpecialLinksConfig], MdastRoot>} */
export default function remarkSpecialLinks(config: SpecialLinksConfig): Transformer {
  return (mdast: Parent, _: VFile) => {
    visit(mdast, 'link', (node: Link & Parent, _: number, parent: Parent) => {
      const markerConfig = findMatchingMarker(node, config);
      if (!markerConfig) {
        return;
      }

      parent.children[parent.children.indexOf(node)] = createJsxNode(markerConfig.converter(node.url));
      ensureEsmImports(mdast, markerConfig.esmImports);
    });
  };
};

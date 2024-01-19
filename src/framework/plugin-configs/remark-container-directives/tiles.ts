import {
  ContainerDirectiveDeclaration,
  ContainerDirectiveTransformerProps
} from "../../plugins/remark-container-directives/model";
import {Optional} from "../../util/optional";
import {jsxFlowElementFrom} from "../../plugins/shared/util/jsx-node-util";
import {ImportType} from "../../plugins/shared/models";

interface TilesProps extends ContainerDirectiveTransformerProps {}

interface TileProps extends ContainerDirectiveTransformerProps {
  href: string,
}

const Tiles = {
  name: 'Tiles',
  transform: ({children}: TilesProps) => Optional.of(jsxFlowElementFrom({
    componentName: 'TileGrid',
    attributes: []
  }, children)),
  esmImports: [{
    sourcePackage: '@site/src/app/components/tiles/TileGrid',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'TileGrid'}],
  }]
} as ContainerDirectiveDeclaration;

const Tile = {
  name: 'Tile',
  transform: ({label, href, children}: TileProps) => Optional.of(jsxFlowElementFrom({
    componentName: 'Tile',
    attributes: [
      {name: "title", value: label},
      {name: "href", value: href},
    ]
  }, children)),
  esmImports: [{
    sourcePackage: '@site/src/app/components/tiles/Tile',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'Tile'}],
  }]
} as ContainerDirectiveDeclaration;

export default [
  Tiles,
  Tile
] as ContainerDirectiveDeclaration[];

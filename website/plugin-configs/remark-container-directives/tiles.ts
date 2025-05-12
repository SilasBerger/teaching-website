import {
    ContainerDirectiveDeclaration,
    ContainerDirectiveTransformerProps
} from '../../plugins/remark-container-directives/model';
import { Optional } from '../../utils/optional';
import { jsxFlowElementFrom } from '../../plugins/shared/util/jsx-node-util';
import { ImportType } from '../../plugins/shared/models';
import { Layout } from '@tdev-components/tiles/TileGrid';

interface TilesProps extends ContainerDirectiveTransformerProps {
    layout: Layout;
    preventGrowOnHover: string;
}

interface TileProps extends ContainerDirectiveTransformerProps {
    href: string;
}

const Tiles = {
    name: 'Tiles',
    transform: ({ layout, preventGrowOnHover, children }: TilesProps) => {
        const attributes = [];
        if (layout !== undefined) {
            attributes.push({ name: 'layout', value: layout });
        }
        if (preventGrowOnHover !== undefined) {
            attributes.push({ name: 'preventGrowOnHover', value: preventGrowOnHover });
        }

        return Optional.of(
            jsxFlowElementFrom(
                {
                    componentName: 'TileGrid',
                    attributes: attributes
                },
                children
            )
        );
    },
    esmImports: [
        {
            sourcePackage: '@tdev-components/tiles/TileGrid',
            specifiers: [{ type: ImportType.DEFAULT_IMPORT, name: 'TileGrid' }]
        }
    ]
} as ContainerDirectiveDeclaration;

const Tile = {
    name: 'Tile',
    transform: ({ label, href, children }: TileProps) =>
        Optional.of(
            jsxFlowElementFrom(
                {
                    componentName: 'Tile',
                    attributes: [
                        { name: 'title', value: label },
                        { name: 'href', value: href }
                    ]
                },
                children
            )
        ),
    esmImports: [
        {
            sourcePackage: '@tdev-components/tiles/Tile',
            specifiers: [{ type: ImportType.DEFAULT_IMPORT, name: 'Tile' }]
        }
    ]
} as ContainerDirectiveDeclaration;

export default [Tiles, Tile] as ContainerDirectiveDeclaration[];

import {
    ContainerDirectiveDeclaration,
    ContainerDirectiveTransformerProps
} from '../../plugins/remark-container-directives/model';
import { ImportType } from '../../plugins/shared/models';
import { jsxFlowElementFrom } from '../../plugins/shared/util/jsx-node-util';
import { Optional } from '../../utils/optional';

interface Props extends ContainerDirectiveTransformerProps {}

export default {
    name: 'Hero',
    transform: ({ children }: Props) =>
        Optional.of(
            jsxFlowElementFrom(
                {
                    componentName: 'HeroContainer',
                    attributes: []
                },
                children
            )
        ),
    esmImports: [
        {
            sourcePackage: '@tdev-components/HeroContainer',
            specifiers: [{ type: ImportType.DEFAULT_IMPORT, name: 'HeroContainer' }]
        }
    ]
} as ContainerDirectiveDeclaration;

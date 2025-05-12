import {
    ContainerDirectiveDeclaration,
    ContainerDirectiveTransformerProps
} from '../../plugins/remark-container-directives/model';
import { jsxFlowElementFrom } from '../../plugins/shared/util/jsx-node-util';
import { ImportType } from '../../plugins/shared/models';
import { Optional } from '../../utils/optional';

interface Props extends ContainerDirectiveTransformerProps {}

function admonitionBlock(name: string, type: string): ContainerDirectiveDeclaration {
    return {
        name: name,
        transform: ({ label, children }: Props) =>
            Optional.of(
                jsxFlowElementFrom(
                    {
                        componentName: 'Admonition',
                        attributes: [
                            { name: 'type', value: type },
                            { name: 'title', value: label }
                        ]
                    },
                    children
                )
            ),
        esmImports: [
            {
                sourcePackage: '@tdev/theme/Admonition',
                specifiers: [{ type: ImportType.DEFAULT_IMPORT, name: 'Admonition' }]
            }
        ]
    };
}

export default [
    admonitionBlock('danger', 'danger'),
    admonitionBlock('warning', 'warning'),
    admonitionBlock('key', 'key'),
    admonitionBlock('definition', 'definition'),
    admonitionBlock('insight', 'insight'),
    admonitionBlock('info', 'info'),
    admonitionBlock('tip', 'info'),
    admonitionBlock('note', 'info'),
    admonitionBlock('aufgabe', 'aufgabe')
] as ContainerDirectiveDeclaration[];

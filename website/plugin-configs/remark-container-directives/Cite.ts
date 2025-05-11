import {
    ContainerDirectiveDeclaration,
    ContainerDirectiveTransformerProps
} from '../../plugins/remark-container-directives/model';
import { Optional } from '../../utils/optional';
import { jsxFlowElementFrom } from '../../plugins/shared/util/jsx-node-util';
import { ImportType } from '../../plugins/shared/models';
import { Node, Parent } from 'unist';

interface Props extends ContainerDirectiveTransformerProps {}

function flattenUniqueChildParagraph(directiveChildren: Node[]): Node[] {
    if (directiveChildren.length !== 1) {
        console.warn(`Expected exactly 1 child in Cite directive, found ${directiveChildren.length}`);
        return [];
    }

    const child = directiveChildren[0];
    if (child.type !== 'paragraph') {
        console.warn(`Expected unique child in Cite directive to be of type paragraph, was ${child.type}`);
        return [];
    }

    return (child as Parent).children;
}

export default {
    name: 'Cite',
    transform: ({ children }: Props) =>
        Optional.of(
            jsxFlowElementFrom(
                {
                    componentName: 'Citation',
                    attributes: []
                },
                flattenUniqueChildParagraph(children)
            )
        ),
    esmImports: [
        {
            sourcePackage: '@tdev-components/Citation',
            specifiers: [{ type: ImportType.DEFAULT_IMPORT, name: 'Citation' }]
        }
    ]
} as ContainerDirectiveDeclaration;

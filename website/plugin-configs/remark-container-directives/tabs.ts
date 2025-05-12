import {
    ContainerDirectiveDeclaration,
    ContainerDirectiveTransformerProps
} from '../../plugins/remark-container-directives/model';
import { Optional } from '../../utils/optional';
import { jsxFlowElementFrom } from '../../plugins/shared/util/jsx-node-util';
import { ImportType } from '../../plugins/shared/models';

interface TabsProps extends ContainerDirectiveTransformerProps {}

interface TabProps extends ContainerDirectiveTransformerProps {
    value: string;
}

const Tabs = {
    name: 'Tabs',
    transform: ({ label, children }: TabsProps) =>
        Optional.of(
            jsxFlowElementFrom(
                {
                    componentName: 'Tabs',
                    attributes: [{ name: 'groupId', value: label }]
                },
                children
            )
        ),
    esmImports: [
        {
            sourcePackage: '@theme/Tabs',
            specifiers: [{ type: ImportType.DEFAULT_IMPORT, name: 'Tabs' }]
        }
    ]
} as ContainerDirectiveDeclaration;

const Tab = {
    name: 'Tab',
    transform: ({ label, value, children }: TabProps) =>
        Optional.of(
            jsxFlowElementFrom(
                {
                    componentName: 'TabItem',
                    attributes: [
                        { name: 'value', value: value ?? label },
                        { name: 'label', value: label }
                    ]
                },
                children
            )
        ),
    esmImports: [
        {
            sourcePackage: '@theme/TabItem',
            specifiers: [{ type: ImportType.DEFAULT_IMPORT, name: 'TabItem' }]
        }
    ]
} as ContainerDirectiveDeclaration;

export default [Tab, Tabs] as ContainerDirectiveDeclaration[];

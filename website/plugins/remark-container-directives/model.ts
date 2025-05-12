import { EsmImport } from '../shared/models';
import { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import { Optional } from '../../utils/optional';
import { Node } from 'unist';

export interface ContainerDirectiveDeclaration {
    name: string;
    transform: ContainerDirectiveTransformer<any>;
    esmImports: EsmImport[];
}

export type ContainerDirectiveTransformer<T extends ContainerDirectiveTransformerProps> = (
    props: T
) => Optional<MdxJsxFlowElement>;

export interface ContainerDirectiveTransformerProps {
    label?: string;
    class?: string;
    children?: Node[];
}

export interface ContainerDirectivesConfig {
    declarations: ContainerDirectiveDeclaration[];
}

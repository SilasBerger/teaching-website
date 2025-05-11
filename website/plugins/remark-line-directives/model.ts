import { EsmImport } from '../shared/models';
import { Optional } from '../../utils/optional';
import { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx';
import { PhrasingContent, DefinitionContent, BlockContent } from 'mdast';

export interface LineDirectivesConfig {
    textDirectives: TextDirectiveDeclaration<any>[];
    leafDirectives: LeafDirectiveDeclaration<any>[];
}

export interface LineDirectiveDeclarationBase {
    name: string;
    esmImports: EsmImport[];
}

export interface TextDirectiveDeclaration<T extends TextDirectiveTransformerProps>
    extends LineDirectiveDeclarationBase {
    transform: TextDirectiveTransformer<T>;
}

export interface LeafDirectiveDeclaration<T extends LeafDirectiveTransformerProps>
    extends LineDirectiveDeclarationBase {
    transform: LeafDirectiveTransformer<T>;
}

export type LineDirectiveDeclaration = TextDirectiveDeclaration<any> | LeafDirectiveDeclaration<any>;

export type TextDirectiveTransformer<T extends TextDirectiveTransformerProps> = (
    attributes: T
) => Optional<MdxJsxTextElement>;

export type LeafDirectiveTransformer<T extends LeafDirectiveTransformerProps> = (
    attributes: T
) => Optional<MdxJsxFlowElement>;

export interface LineDirectiveTransformerProps {
    literal?: string;
    class?: string;
}

export interface TextDirectiveTransformerProps extends LineDirectiveTransformerProps {
    children: PhrasingContent[];
}

export interface LeafDirectiveTransformerProps extends LineDirectiveTransformerProps {
    children: (DefinitionContent | BlockContent)[];
}

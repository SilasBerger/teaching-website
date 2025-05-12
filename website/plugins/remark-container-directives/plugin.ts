import { Transformer } from 'unified';
import { Literal, Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { ContainerDirective } from 'mdast-util-directive';
import { ContainerDirectiveDeclaration, ContainerDirectivesConfig } from './model';
import { Optional } from '../../utils/optional';
import { replaceNode } from '../shared/util/mdast-util';
import { ensureEsmImports } from '../shared/util/mdast-util-esm-imports';
import { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

/** @type {import('unified').Plugin<[ContainerDirectivesConfig], MdastRoot>} */
export default function remarkContainerDirectives(config: ContainerDirectivesConfig): Transformer {
    return (mdast: Parent) => {
        if (!config) {
            console.warn('remarkContainerDirectives invoked without config: Plugin has no effect');
            return;
        }

        visit(mdast, 'containerDirective', (directive: ContainerDirective, _: number, parent: Parent) => {
            matchDeclaration(config.declarations, directive).ifPresent((declaration) => {
                const jsxElement = transform(directive, declaration);
                if (jsxElement.isEmpty()) {
                    console.warn(`Received no JSX element from declaration '${declaration.name}'`);
                    return;
                }

                replaceNode(parent, directive, jsxElement.get());
                ensureEsmImports(mdast, declaration.esmImports);
            });
        });
    };
}

function matchDeclaration(
    declarations: ContainerDirectiveDeclaration[],
    directive: ContainerDirective
): Optional<ContainerDirectiveDeclaration> {
    return Optional.of(declarations.find((declaration) => declaration.name === directive.name));
}

function transform(
    directive: ContainerDirective,
    declaration: ContainerDirectiveDeclaration
): Optional<MdxJsxFlowElement> {
    return declaration.transform({
        ...directive.attributes,
        label: consumeDirectiveLabelIfApplicable(directive),
        children: directive.children
    });
}
function consumeDirectiveLabelIfApplicable(directive: ContainerDirective) {
    return consumeDirectiveLabelChild(directive) ?? extractDirectiveLabelFromAdmonitionData(directive);
}

function consumeDirectiveLabelChild(directive: ContainerDirective): string {
    const directiveLabelChild = directive.children.find(
        (child) => child.data && (child.data as any).directiveLabel === true
    );

    if (!directiveLabelChild) {
        return;
    }

    const value = (directiveLabelChild as Parent).children
        .filter((child) => child.type === 'text')
        .map((child) => (child as Literal).value as string)
        .find((value) => !!value);

    if (value) {
        // Remove directive label child from directive's children.
        directive.children.splice(directive.children.indexOf(directiveLabelChild), 1);
    }

    return value;
}

function extractDirectiveLabelFromAdmonitionData(directive: ContainerDirective) {
    return (directive.data as any)?.hProperties?.title;
}

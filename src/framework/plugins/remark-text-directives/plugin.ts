import {Transformer} from "unified";
import {VFile} from "vfile";
import {Literal, Node, Parent} from "unist";
import {visit} from "unist-util-visit";
import {TextDirective} from "mdast-util-directive";
import {EsmImport} from "../shared/models";
import {Optional} from "../../util/optional";
import {Log} from "../../util/log";
import {ensureEsmImports} from "../shared/util/mdast-util-esm-imports";
import {MdxJsxTextElement} from "mdast-util-mdx-jsx";
import {PhrasingContent} from "mdast";

export interface TextDirectivesConfig {
  declarations: TextDirectiveDeclaration<any>[];
}

export interface TextDirectiveDeclaration<T extends TextDirectiveTransformerProps> {
  name: string;
  transform: TextDirectiveTransformer<T>,
  esmImports: EsmImport[];
}

export type TextDirectiveTransformer<T extends TextDirectiveTransformerProps>
  = (attributes: T) => Optional<MdxJsxTextElement>

export interface TextDirectiveTransformerProps {
  children: PhrasingContent[],
  literal?: string,
  class?: string;
}

/** @type {import('unified').Plugin<[TextDirectivesConfig], MdastRoot>} */
export default function remarkTextDirectives(config: TextDirectivesConfig): Transformer {
  if (!config) {
    console.warn('remarkTextDirectives invoked without config: Plugin has no effect');
    return;
  }

  return (mdast: Parent, _: VFile) => {
    visit(mdast, 'textDirective', (node: TextDirective, _: number, parent: Parent) => {
      matchDeclaration(config, node).ifPresent(declaration => {
        const jsxElement = transform(node, declaration);
        if (jsxElement.isEmpty()){
          Log.instance.warn(`Received no JSX element from TextDirectiveDeclaration '${declaration.name}'`);
          return;
        }

        parent.children[parent.children.indexOf(node)] = jsxElement.get();
        ensureEsmImports(mdast, declaration.esmImports);
      });
    });
  };
};

function matchDeclaration(config: TextDirectivesConfig, node: TextDirective): Optional<TextDirectiveDeclaration<any>> {
  return Optional.of(config.declarations.find(declaration => declaration.name === node.name));
}

function transform(node: TextDirective, declaration: TextDirectiveDeclaration<any>): Optional<MdxJsxTextElement> {
  const children = node.children;
  const literal = children.length === 1 && children[0].type == 'text'
    ? (children[0] as Literal).value
    : undefined;
  return declaration.transform({
    ...node.attributes,
    literal,
    childrenRaw: [...children],
  });
}

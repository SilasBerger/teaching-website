import {Transformer} from "unified";
import {VFile} from "vfile";
import {Node, Parent} from "unist";
import {visit} from "unist-util-visit";
import {TextDirective} from "mdast-util-directive";
import {TextDirectiveDeclaration} from "../shared/models";

export interface TextDirectivesConfig {
  declarations: TextDirectiveDeclaration[];
}

/** @type {import('unified').Plugin<[TextDirectivesConfig], MdastRoot>} */
export default function remarkTextDirectives(config: TextDirectivesConfig): Transformer {
  if (!config) {
    console.warn('remarkTextDirectives invoked without config: Plugin has no effect');
    return;
  }

  return (mdast: Node, _: VFile) => {
    visit(mdast, 'textDirective', (node: TextDirective, _: number, parent: Parent) => {
      console.log(node);
    });
  };
};

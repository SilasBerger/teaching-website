import {Parent, Node} from "unist";
import {visit} from "unist-util-visit";

export function replaceNode(mdast: Parent, target: Node, replacement: Node) {
  visit(
    mdast,
    (node: Node) => node === target,
    (node: Node, _: number, parent: Parent) => {
      parent.children[parent.children.indexOf(node)] = replacement;
    }
  );
}

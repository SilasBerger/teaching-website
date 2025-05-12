import { Parent, Node } from 'unist';
import { visit } from 'unist-util-visit';

/**
 * Replace `target` with `replacement` in `parent.children`.
 * @param parent The node within whose children to do the replacement.
 * @param target The node to be replaced - must be included in `parent.children`.
 * @param replacement The node to replace `target` with.
 */
export function replaceNode(parent: Parent, target: Node, replacement: Node) {
    parent.children[parent.children.indexOf(target)] = replacement;
}

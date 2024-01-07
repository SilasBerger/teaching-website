import {Transformer} from "unified";
import {VFile} from "vfile";
import {Parent, Node} from "unist";
import {visit} from "unist-util-visit";
import {Directives} from "mdast-util-directive";
import {ensureEsmImports} from "./util/mdast-util-esm-imports";
import {EsmImport, JsxElementSpec} from "./util/models";
import {createJsxNode} from "./util/jsx-node-util";

export interface FencedBlockConfig {
  keywords: string[];
  converter: (type: string, header: string) => JsxElementSpec,
  esmImports: EsmImport[];
}

export interface FencedBlocksConfig {
  blocks: FencedBlockConfig[];
}

/** @type {import('unified').Plugin<[FencedBlocksConfig], MdastRoot>} */
export default function remarkFencedBlocks(config: FencedBlocksConfig): Transformer {
  return (mdast: Parent, _: VFile) => {
    if (!config) {
      console.warn('remarkFencedBlocks invoked without options, bailing');
      return;
    }
    const esmImports = new Set<EsmImport>();
    transformContainerDirectives(mdast, config.blocks, esmImports);
    ensureEsmImports(mdast, Array.from(esmImports.values()))
  };
};

function transformContainerDirectives(mdast: Parent, blockConfigs: FencedBlockConfig[], esmImports: Set<EsmImport>): void {
  visit(mdast, 'containerDirective', (containerRoot: Directives, _: number, parent: Parent) => {
    const containerName: string = containerRoot.name;

    // Find a block config whose keywords contain this container directive's name.
    const matchingBlockConfig = blockConfigs
      .find(config => config.keywords.includes(containerName));
    if (!matchingBlockConfig) {
      return;
    }

    // Since we have discovered a block of this type, collect its required ESM imports.
    matchingBlockConfig.esmImports.forEach(esmImport => esmImports.add(esmImport));

    // Create new JSX node from container root + converter, replace container root node.
    replaceContainerRootWithJsxNode(matchingBlockConfig, containerRoot, parent);
  });
}

function replaceContainerRootWithJsxNode(blockConfig: FencedBlockConfig, containerRoot: Directives, parent: Parent) {
  const jsxNodeSpec = blockConfig.converter(
    containerRoot.name,
    (containerRoot.data as any).hProperties?.title
  );

  const jsxNode = createJsxNode(jsxNodeSpec, containerRoot.children)

  // Replace container root node with new JSX node in container root's parent.
  const containerRootIndex = parent.children.indexOf(containerRoot);
  parent.children[containerRootIndex] = jsxNode;
}

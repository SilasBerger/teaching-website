import {Transformer} from "unified";
import {VFile} from "vfile";
import {Parent, Node} from "unist";
import {visit} from "unist-util-visit";
import {Directives} from "mdast-util-directive";
import {ensureEsmImports, EsmImport} from "./util/mdast-util-esm-imports";

export enum JsxElementType {
  FLOW_ELEMENT = 'mdxJsxFlowElement',
  TEXT_ELEMENT = 'mdxJsxTextElement',
}

export interface FencedBlockJsxNodeSpec {
  jsxElementType: JsxElementType;
  componentName: string;
  attributes: {name: string, value: string}[]
}

export interface FencedBlockConfig {
  namePattern: RegExp;
  converter: (type: string, header: string) => FencedBlockJsxNodeSpec, // type=name, header=data.hProperties.title
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

    // console.log(blockConfigs);

    // Find a block config whose name pattern matches this container directive's name.
    const matchingBlockConfig = blockConfigs
      .find(config => containerName.match(config.namePattern));
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
  const jsxNode = {
    type: jsxNodeSpec.jsxElementType,
    name: jsxNodeSpec.componentName,
    attributes: jsxNodeSpec.attributes.map(attr => {
      return {
        type: 'mdxJsxAttribute',
        name: attr.name,
        value: attr.value,
      }
    }),
    children: containerRoot.children,
    data: {_mdxExplicitJsx: true}
  }

  // Replace container root node with new JSX node in container root's parent.
  const containerRootIndex = parent.children.indexOf(containerRoot);
  parent.children[containerRootIndex] = jsxNode;
}

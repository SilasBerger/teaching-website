import {Parent} from "unist";
import {visit} from "unist-util-visit";

export enum ImportType {
  DEFAULT_IMPORT = 'ImportDefaultSpecifier',
  NAMED_IMPORT = 'ImportSpecifier',
}

export interface EsmImportSpecifier {
  name: string,
  type: ImportType;
}

export interface EsmImport {
  sourcePackage: string,
  specifiers: EsmImportSpecifier[];
}

interface ImportSpecifierEntry {
  type: ImportType;
  imported: {
    type: 'Identifier';
    name: string;
  };
  local: {
    type: 'Identifier';
    name: string;
  };
}

interface ImportSource {
  type: 'Literal';
  value: string,
}

interface ImportDeclarationEntry {
  type: 'ImportDeclaration';
  specifiers: ImportSpecifierEntry[];
  source: ImportSource;
}

interface EsmImportsNode {
  type: 'mdxjsEsm',
  data: {
    estree: {
      type: 'Program',
      sourceType: 'module',
      body: ImportDeclarationEntry[],
    }
  }
}

export function ensureEsmImports(mdast: Parent, importDeclarations: EsmImport[]): void {
  const esmImportsNode = ensureEsmImportsNode(mdast);
  importDeclarations.forEach(esmImport => {
    const declarationEntry = ensureImportDeclarationEntry(esmImportsNode.data.estree.body, esmImport);
    ensureImportSpecifierEntries(declarationEntry, esmImport);
  });
}

export function ensureImportDeclarationEntry(declarationEntries: ImportDeclarationEntry[], esmImport: EsmImport): ImportDeclarationEntry {
  const existingEntry = declarationEntries
    .filter(entry => entry.source && entry.source.value)
    .find(entry => entry.source.value === esmImport.sourcePackage);

  if (existingEntry) {
    return existingEntry;
  }

  const declarationEntry: ImportDeclarationEntry = {
    type: 'ImportDeclaration',
    specifiers: [],
    source: {
      type: 'Literal',
      value: esmImport.sourcePackage,
    },
  };
  declarationEntries.push(declarationEntry);
  return declarationEntry;
}

function ensureImportSpecifierEntries(declarationEntry: ImportDeclarationEntry, esmImport: EsmImport): void {
  esmImport.specifiers
    .forEach(specifier => ensureImportSpecifierEntry(declarationEntry, specifier))
}

function ensureImportSpecifierEntry(declarationEntry: ImportDeclarationEntry, esmImportSpecifier: EsmImportSpecifier): void {
  const existingSpecifier = declarationEntry.specifiers
    .find(specifier => specifier.imported.name === esmImportSpecifier.name);

  if (existingSpecifier) {
    return;
  }

  declarationEntry.specifiers.push({
    type: esmImportSpecifier.type,
    imported: {
      type: 'Identifier',
      name: esmImportSpecifier.name
    },
    local: {
      type: 'Identifier',
      name: esmImportSpecifier.name
    },
  });
}

function ensureEsmImportsNode(mdast: Parent): EsmImportsNode {
  let esmImportsNode;
  visit(mdast, 'mdxjsEsm', (node: any) => {
    if (!node.data?.estree) {
      return;
    }

    const estree = node.data.estree;
    if (estree.type === 'Program' && estree.sourceType === 'module') {
      esmImportsNode = node;
    }
  });

  if (esmImportsNode) {
    return esmImportsNode;
  }

  esmImportsNode = {
    type: 'mdxjsEsm',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [],
      }
    }
  };
  mdast.children = [esmImportsNode, ...mdast.children];
  return esmImportsNode;
}

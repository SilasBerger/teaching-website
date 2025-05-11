import { Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { EsmImport, EsmImportSpecifier, ImportType } from '../models';

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
    value: string;
}

interface ImportDeclarationEntry {
    type: 'ImportDeclaration';
    specifiers: ImportSpecifierEntry[];
    source: ImportSource;
}

interface EsmImportsNode {
    type: 'mdxjsEsm';
    data: {
        estree: {
            type: 'Program';
            sourceType: 'module';
            body: ImportDeclarationEntry[];
        };
    };
}

/**
 * Ensure `mdast` has import declaration nodes for all entries in `importDeclarations`.
 *
 * @param mdast the mdAST root
 * @param importDeclarations the import declarations to ensure - may be empty or undefined
 */
export function ensureEsmImports(mdast: Parent, importDeclarations: EsmImport[]): void {
    if (!importDeclarations) {
        return;
    }
    const esmImportsNodes = ensureEsmImportsNode(mdast);
    importDeclarations.forEach((esmImport) => {
        const declarationEntries = ensureImportDeclarationEntry(esmImportsNodes, esmImport);
        ensureImportSpecifierEntries(declarationEntries, esmImport);
    });
}

/**
 * Find an existing `ImportDeclarationEntry` for the source package defined by `esmImport` across all `importNodes`. If
 * none exists, create one, and attach it to the first entry in `importNodes`.
 *
 * @param importNodes all existing EsmImportNodes in the AST
 * @param esmImport the import definition for which to ensure an ImportDeclarationEntry
 * @return the found or created `ImportDeclarationEntry`
 * @throws Exception if there is more than one existing `ImportDeclarationEntry` for the source package defined by
 * `esmImport`
 */
export function ensureImportDeclarationEntry(
    importNodes: EsmImportsNode[],
    esmImport: EsmImport
): ImportDeclarationEntry {
    const declarationEntries = importNodes.flatMap((importNode) => importNode.data.estree.body);

    const existingEntries = declarationEntries
        .filter((entry) => entry.type === 'ImportDeclaration')
        .filter((entry) => !!entry?.source?.value)
        .filter((entry) => entry.source.value === esmImport.sourcePackage);

    if (existingEntries.length > 1) {
        throw {
            msg: `Invalid state: found multiple import declaration entries for source package ${esmImport.sourcePackage}`,
            declarationEntriesFound: existingEntries
        };
    }

    if (existingEntries.length === 1) {
        return existingEntries[0];
    }

    const createdDeclarationEntry: ImportDeclarationEntry = {
        type: 'ImportDeclaration',
        specifiers: [],
        source: {
            type: 'Literal',
            value: esmImport.sourcePackage
        }
    };
    importNodes[0].data.estree.body.push(createdDeclarationEntry);
    return createdDeclarationEntry;
}

/**
 * Ensure all `ImportSpecifierEntry` entries on `declarationEntry` as defined by `esmImport`.
 *
 * @param declarationEntry the `ImportDeclarationEntry` for this `esmImport`'s source package
 * @param esmImport the import definition with its specifiers to ensure
 * @see ensureImportSpecifierEntry()
 */
function ensureImportSpecifierEntries(declarationEntry: ImportDeclarationEntry, esmImport: EsmImport): void {
    esmImport.specifiers.forEach((specifier) => ensureImportSpecifierEntry(declarationEntry, specifier));
}

/**
 * Add the specifier declared by `esmImportSpecifier` to `declarationEntry` if it doesn't already exist.
 *
 * @param declarationEntry the `ImportDeclarationEntry` for the source package to which this `esmImportSpecifier`
 * belongs
 * @param esmImportSpecifier the specifier ensure on `declarationEntry`
 */
function ensureImportSpecifierEntry(
    declarationEntry: ImportDeclarationEntry,
    esmImportSpecifier: EsmImportSpecifier
): void {
    const existingSpecifier = declarationEntry.specifiers.find((specifier) => {
        return (
            specifier.imported?.name === esmImportSpecifier.name ||
            specifier.local?.name === esmImportSpecifier.name
        );
    });

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
        }
    });
}

/**
 * Find all nodes of type `mdxjsEsm` with an esTree with type `Program` and `sourceType` module. If none exist,
 * create one, and attach it to the `mdast`'s children.
 *
 * @param mdast the mdAST root
 */
function ensureEsmImportsNode(mdast: Parent): EsmImportsNode[] {
    const esmImportsNodes: EsmImportsNode[] = [];
    visit(mdast, 'mdxjsEsm', (node: any) => {
        if (!node.data?.estree) {
            return;
        }

        const estree = node.data.estree;
        if (estree.type === 'Program' && estree.sourceType === 'module') {
            esmImportsNodes.push(node);
        }
    });

    if (esmImportsNodes.length > 0) {
        return esmImportsNodes;
    }

    const createdNode = {
        type: 'mdxjsEsm',
        data: {
            estree: {
                type: 'Program',
                sourceType: 'module',
                body: []
            }
        }
    } as EsmImportsNode;
    esmImportsNodes.push(createdNode);
    mdast.children = [createdNode, ...mdast.children];
    return esmImportsNodes;
}

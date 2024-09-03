import { visit } from 'unist-util-visit';
import type { Plugin, Processor, Transformer } from 'unified';
import type { MdxJsxTextElement, MdxjsEsm } from 'mdast-util-mdx';
import type { TextDirective } from 'mdast-util-directive';
import { camelCased, captialize, toJsxAttribute, transformAttributes } from '../helpers';
import { Parent, Text } from 'mdast';

const MDI_PROPS = [
    {
        name: 'title',
        types: ['string'],
        optional: true,
        description: 'A11y <title>{title}</title>'
    },
    {
        name: 'description',
        types: ['string'],
        optional: true,
        description: 'A11y <desc>{desc}</desc>'
    },
    {
        name: 'size',
        types: ['number', 'string'],
        optional: true,
        description: '{size * 1.5}rem, 1em, 48px'
    },
    {
        name: 'horizontal',
        types: ['bool'],
        optional: true,
        description: 'Flip Horizontal'
    },
    {
        name: 'vertical',
        types: ['bool'],
        optional: true,
        description: 'Flip Vertical'
    },
    {
        name: 'rotate',
        types: ['number'],
        optional: true,
        description: 'degrees 0 to 360'
    },
    {
        name: 'color',
        types: ['string'],
        optional: true,
        description: 'rgb() / rgba() / #000'
    },
    {
        name: 'spin',
        types: ['number', 'bool'],
        optional: true,
        description: 'true = 2s, -2 counterclockwise, {spin}s'
    },
    {
        name: 'className',
        types: ['string'],
        optional: true,
        description: 'additional class names'
    }
];

const IMPORT_MDI_REACT_NODE = {
    type: 'mdxjsEsm',
    value: "import Icon from '@mdi/react';",
    data: {
        estree: {
            type: 'Program',
            body: [
                {
                    type: 'ImportDeclaration',
                    specifiers: [
                        {
                            type: 'ImportDefaultSpecifier',
                            local: {
                                type: 'Identifier',
                                name: 'Icon'
                            }
                        }
                    ],
                    source: {
                        type: 'Literal',
                        value: '@mdi/react',
                        raw: "'@mdi/react'"
                    }
                }
            ],
            sourceType: 'module',
            comments: []
        }
    }
};

const IMPORT_MDI_ICONS = (icons: string[]) => {
    return {
        type: 'mdxjsEsm',
        value: `import { ${icons.join(', ')} } from '@mdi/js';`,
        data: {
            estree: {
                type: 'Program',
                body: [
                    {
                        type: 'ImportDeclaration',
                        specifiers: icons.map((icon) => ({
                            type: 'ImportSpecifier',
                            imported: {
                                type: 'Identifier',
                                name: icon
                            },
                            local: {
                                type: 'Identifier',
                                name: icon
                            }
                        })),
                        source: {
                            type: 'Literal',
                            value: '@mdi/js',
                            raw: "'@mdi/js'"
                        }
                    }
                ],
                sourceType: 'module',
                comments: []
            }
        }
    };
};

const plugin: Plugin = function plugin(
    this: Processor,
    optionsInput?: {
        colorMapping?: Record<string, string>;
        defaultSize?: number | string;
    }
): Transformer {
    return async (root) => {
        let hasMdiIcons = false;
        const includedMdiIcons = new Set();
        const newMdiIcons = new Set<string>();
        let includesIcon = false;

        visit(root, (node, idx, parent: Parent) => {
            if (node.type === 'mdxjsEsm') {
                const n = node as unknown as MdxjsEsm;
                if (/import.*(Icon|{.*default\s+as\s+\w+.*}).*from '@mdi\/react'/.test(n.value || '')) {
                    includesIcon = true;
                }
                if (/import.*{(.*)}.*from\s+'@mdi\/js'/.test(n.value || '')) {
                    const match = n.value.match(/import.*{(.*)}.*from\s+'@mdi\/js'/);
                    if (match) {
                        match[1].split(',').forEach((s) => {
                            const ico = s.trim();
                            if (ico.startsWith('mdi')) {
                                includedMdiIcons.add(ico);
                            }
                        });
                    }
                }
                return;
            }
            if (node.type !== 'textDirective') {
                return;
            }
            if ((node as unknown as { name: string }).name !== 'mdi') {
                return;
            }
            // const parent = _parent as Parent;
            hasMdiIcons = true;
            const directive = node as unknown as TextDirective;
            const icon = (directive.children[0] as Text).value;
            const mdiIcon = `mdi${captialize(camelCased(icon))}`;
            if (!includedMdiIcons.has(mdiIcon)) {
                newMdiIcons.add(mdiIcon);
            }
            const rawAttributes = transformAttributes(directive.attributes || {});
            if (!('size' in rawAttributes.attributes)) {
                delete rawAttributes.style['size'];
                rawAttributes.attributes.size = optionsInput?.defaultSize || 1.5;
            }
            if ('color' in rawAttributes.attributes) {
                delete rawAttributes.style['color'];
                const color = rawAttributes.attributes.color as string;
                if (optionsInput?.colorMapping && color in optionsInput.colorMapping) {
                    rawAttributes.attributes.color = optionsInput.colorMapping[color];
                }
            }
            if (
                'className' in rawAttributes.attributes &&
                !/mdi-icon/.test(rawAttributes.attributes.className as string)
            ) {
                rawAttributes.attributes.className = `mdi-icon ${rawAttributes.attributes.className}`;
            } else {
                rawAttributes.attributes.className = 'mdi-icon';
            }
            const attributes = Object.entries(rawAttributes.attributes).map(([key, value]) =>
                toJsxAttribute(key, value)
            );

            const iconNode: MdxJsxTextElement = {
                name: 'Icon',
                type: 'mdxJsxTextElement',
                attributes: [
                    {
                        type: 'mdxJsxAttribute',
                        name: 'path',
                        value: {
                            type: 'mdxJsxAttributeValueExpression',
                            value: mdiIcon,
                            data: {
                                estree: {
                                    type: 'Program',
                                    body: [
                                        {
                                            type: 'ExpressionStatement',
                                            expression: {
                                                type: 'Identifier',
                                                name: mdiIcon
                                            }
                                        }
                                    ],
                                    sourceType: 'module'
                                }
                            }
                        }
                    },
                    ...attributes
                ],
                children: []
            };
            (parent.children as any)[idx] = iconNode;
        });

        if (hasMdiIcons && !includesIcon) {
            (root as any).children.unshift(IMPORT_MDI_REACT_NODE);
        }
        if (newMdiIcons.size > 0) {
            (root as any).children.unshift(IMPORT_MDI_ICONS([...newMdiIcons]));
        }
    };
};

export default plugin;

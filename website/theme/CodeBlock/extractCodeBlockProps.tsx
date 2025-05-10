import React from 'react';
import { type Props as CodeBlockProps } from '@theme/CodeBlock';

const MDX_CODE = 'MDXCode' as const;
const MDX_PRE = 'MDXPre' as const;
const COMPILED_CODE = 'code' as const;
const COMPILED_PRE = 'pre' as const;

const isCode = (node: { type: { name: string } }) => {
    return node.type.name === MDX_CODE || node.type.name === COMPILED_CODE;
};
const isPre = (node: { type: { name: string } }) => {
    return node.type.name === MDX_PRE || node.type.name === COMPILED_PRE;
};

function isReactElementWithNamedType(
    node: any
): node is React.ReactElement<{ children: any }> & { type: { name: string } } {
    return (
        node &&
        typeof node === 'object' &&
        'type' in node &&
        typeof node.type === 'function' &&
        'name' in node.type
    );
}

export const extractCodeBlockProps = (from: React.ReactNode, depth: number = 0): CodeBlockProps | null => {
    const children = Array.isArray(from) ? from : [from];
    for (const child of children) {
        if (!isReactElementWithNamedType(child)) {
            continue;
        }
        if (isCode(child)) {
            /**
             * this indicates that we found an inline code block...
             */
            return child.props as CodeBlockProps;
        }
        if (isPre(child)) {
            /**
             * this is a Docusaurus MDXPre component
             * @see https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/MDXComponents/Pre.tsx
             * --> MDXPre is a wrapper around the CodeBlock component
             */
            const innerChild = child.props?.children;
            if (isReactElementWithNamedType(innerChild) && isCode(innerChild)) {
                return innerChild.props as CodeBlockProps;
            }
        }
        if (depth > 0 && child.props?.children) {
            const result = extractCodeBlockProps(child.props?.children, depth - 1);
            if (result) {
                return result;
            }
        }
    }
    return null;
};

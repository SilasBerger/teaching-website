import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@tdev-hooks/useStore';
import CodeBlock from '@theme/CodeBlock';
import { templateReplacer } from '../templateReplacer';
import { extractCodeBlockProps } from '@tdev/theme/CodeBlock/extractCodeBlockProps';

interface Props {
    children: React.ReactNode;
}

const TemplateCode = observer((props: Props) => {
    const pageStore = useStore('pageStore');
    const { current } = pageStore;
    if (!current) {
        return null;
    }
    const childProps = extractCodeBlockProps(props.children);
    if (!childProps) {
        return <>{props.children}</>;
    }
    if (typeof childProps.children !== 'string') {
        return <CodeBlock {...childProps} />;
    }

    const code = templateReplacer(childProps.children, pageStore.current?.dynamicValues);
    const metastring = templateReplacer(childProps.metastring, pageStore.current?.dynamicValues);

    return (
        <CodeBlock {...childProps} metastring={metastring}>
            {code}
        </CodeBlock>
    );
});

export default TemplateCode;

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@tdev-hooks/useStore';
import { templateReplacer } from '../templateReplacer';
import { extractCodeBlockProps } from '@tdev/theme/CodeBlock/extractCodeBlockProps';

interface BaseProps {
    as?: 'code' | 'boxed';
}
interface NameProps extends BaseProps {
    name: string;
}
interface ChildProps extends BaseProps {
    children: React.ReactNode;
}

type Props = NameProps | ChildProps;

const Val = observer((props: Props) => {
    const pageStore = useStore('pageStore');
    const { current } = pageStore;
    if (!current) {
        return null;
    }
    let value = '';
    if ('children' in props) {
        const codeProps = extractCodeBlockProps(props.children);
        if (!codeProps || typeof codeProps.children !== 'string') {
            return <code>{props.children}</code>;
        }
        value = templateReplacer(codeProps.children, pageStore.current?.dynamicValues);
    } else if ('name' in props) {
        value = current.dynamicValues.get(props.name) || `<${props.name}>`;
    }
    switch (props.as) {
        case 'code':
            return <code>{value}</code>;
        case 'boxed':
            return <strong className="boxed">{value}</strong>;
    }

    return value;
});

export default Val;

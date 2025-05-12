import styles from './styles.module.scss';
import { useEffect, useId, useState } from 'react';
import { useStore } from '@tdev/hooks/useStore';
import { action } from 'mobx';

interface Props {
    id: string;
    defaultValue?: string;
    height?: string;
    fontSize?: string;
}

const TextBoxPlayground = ({ id, defaultValue, height }: Props) => {
    const store = useStore('siteStore').toolsStore;

    const [text, setText] = useState<string>(defaultValue ?? '');

    useEffect(() => {
        setText(store.textFieldPlaygrounds[id] || defaultValue);
    }, []);

    useEffect(() => {
        return action(() => {
            store.textFieldPlaygrounds = {
                ...store.textFieldPlaygrounds,
                [id]: text
            };
        });
    }, [text]);

    return (
        <textarea
            className={styles.textarea}
            style={{ height: height ?? '10rem', fontSize: '0.75rem' }}
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
    );
};

export default TextBoxPlayground;

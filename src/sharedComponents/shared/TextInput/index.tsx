import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

interface Props {
    defaultValue?: string;
    placeholder?: string;
    onChange: (text: string) => void;
    onEnter?: () => void;
    onEscape?: () => void;
    className?: string;
}

const TextInput = observer((props: Props) => {
    const [text, setText] = React.useState(props.defaultValue || '');
    return (
        <input
            type="text"
            placeholder={props.placeholder}
            value={text}
            className={clsx(styles.className, styles.textInput)}
            onChange={(e) => {
                setText(e.target.value);
                props.onChange(e.target.value);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    props.onEnter?.();
                }
                if (e.key === 'Escape') {
                    props.onEscape?.();
                }
            }}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
        />
    );
});

export default TextInput;

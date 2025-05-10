import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@tdev-hooks/useStore';
import TextInput from '@tdev-components/shared/TextInput';
import Button from '@tdev-components/shared/Button';
import { mdiRestore } from '@mdi/js';
import { SIZE_S } from '@tdev-components/shared/iconSizes';

interface Props {
    name: string;
    default?: string;
    label?: string;
    placeholder?: string;
    last?: boolean;
}

const DynamicInput = observer((props: Props) => {
    const pageStore = useStore('pageStore');
    const { current } = pageStore;
    React.useEffect(() => {
        if (current && !current.dynamicValues.has(props.name)) {
            current.setDynamicValue(props.name, props.default);
        }
    }, [props.default, props.name, current]);
    if (!current) {
        return null;
    }
    const value = current.dynamicValues.get(props.name);
    const needsReset = props.default && value !== props.default;
    return (
        <div className={clsx(styles.dynamicInput, props.last && styles.last)}>
            <TextInput
                noAutoFocus
                value={value ?? props.default ?? ''}
                onChange={(val) => {
                    current.setDynamicValue(props.name, val);
                }}
                defaultValue={props.default}
                label={props.label || props.name}
                labelClassName={clsx(styles.label)}
                className={clsx(styles.input)}
                placeholder={props.placeholder}
            />
            {needsReset && (
                <Button
                    className={clsx(styles.resetButton)}
                    icon={mdiRestore}
                    onClick={() => {
                        current.setDynamicValue(props.name, props.default);
                    }}
                    color="secondary"
                    size={SIZE_S}
                    title="Zurücksetzen"
                />
            )}
        </div>
    );
});

export default DynamicInput;

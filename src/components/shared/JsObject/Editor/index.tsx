import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { EditLevel, JsTypes, toJsSchema } from '../toJsSchema';
import clsx from 'clsx';
import styles from './styles.module.scss';
import JsSchemaEditor from './SchemaEditor';
import { toModel } from './models/toModel';
import JsRoot from './models/JsRoot';
import { reaction } from 'mobx';
import AddValue from './Actions/AddValue';
import Button from '@tdev-components/shared/Button';
import { mdiContentSave } from '@mdi/js';
import { SIZE_S } from '@tdev-components/shared/iconSizes';
import _ from 'lodash';
import iParentable from './models/iParentable';

export type CustomAction = (js: iParentable, className: string, key: string | number) => React.ReactNode;

interface Props {
    className?: string;
    js: Record<string, JsTypes> | JsTypes[];
    onSave?: (js: Record<string, JsTypes> | JsTypes[]) => void;
    onUpdate?: (js: Record<string, JsTypes> | JsTypes[]) => void;
    actions?: CustomAction[];
    editLevel?: EditLevel;
}

const SaveButton = observer(
    ({ onSave, jsRoot }: { onSave: (js: Record<string, JsTypes> | JsTypes[]) => void; jsRoot: JsRoot }) => (
        <Button
            color="green"
            onClick={() => {
                jsRoot.save();
                onSave(jsRoot.asJs);
            }}
            size={SIZE_S}
            icon={mdiContentSave}
            iconSide="left"
            text="Speichern"
            disabled={!jsRoot.isDirty}
        />
    )
);

const JsObjectEditor = observer((props: Props) => {
    const jsRoot = useLocalObservable(() => {
        const root = new JsRoot(props.editLevel);
        root.buildFromJs(props.js);
        return root;
    });

    React.useEffect(() => {
        const { onUpdate } = props;
        if (onUpdate) {
            return reaction(
                () => jsRoot.asJs,
                (js) => {
                    onUpdate(js);
                }
            );
        }
    }, [jsRoot]);

    return (
        <div className={clsx(styles.jsObjectEditor, props.className)}>
            <div className={clsx(styles.spacer)} />
            <div>
                <div className={clsx(styles.header)}>
                    <AddValue jsParent={jsRoot} actions={props.actions} className={clsx(styles.actions)} />
                    {props.onSave && <SaveButton onSave={props.onSave} jsRoot={jsRoot} />}
                </div>
                <JsSchemaEditor schema={jsRoot} noName={jsRoot.isArray} actions={props.actions} />
            </div>
            <div className={clsx(styles.spacer)} />
        </div>
    );
});

export default JsObjectEditor;

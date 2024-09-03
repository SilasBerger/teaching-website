import * as React from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';
import CodeBlock from '@theme/CodeBlock';
import { useFirstMainDocument } from '@site/src/hooks/useFirstMainDocument';
import Script, { ScriptMeta } from '@site/src/models/documents/Script';
import Editor from './Editor';
import CodeHistory from './CodeHistory';
import BrythonCommunicator from './BrythonCommunicator';
import { MetaProps } from '@site/src/theme/CodeBlock';
import { observer } from 'mobx-react-lite';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { DocContext } from '../DocumentContext';

export interface Props extends Omit<MetaProps, 'live_jsx' | 'live_py'> {
    title: string;
    lang: string;
    preCode: string;
    postCode: string;
    code: string;
    showLineNumbers: boolean;
    className?: string;
}

export const CodeEditor = observer((props: Props) => {
    const id = props.slim ? undefined : props.id;
    const script = useFirstMainDocument(id, new ScriptMeta(props));
    if (!ExecutionEnvironment.canUseDOM || !script) {
        return <CodeBlock language={props.lang}>{props.code}</CodeBlock>;
    }
    return <CodeEditorComponent script={script} className={props.className} />;
});

export interface ScriptProps {
    script: Script;
    className?: string;
}

const CodeEditorComponent = observer((props: ScriptProps) => {
    const { script } = props;
    return (
        <div className={clsx(styles.wrapper, 'notranslate', props.className)}>
            <DocContext.Provider value={script}>
                <div
                    className={clsx(
                        styles.playgroundContainer,
                        script.meta.slim ? styles.containerSlim : styles.containerBig,
                        'live_py'
                    )}
                >
                    <Editor />
                    {script.meta.hasHistory && <CodeHistory />}
                </div>
                {script.lang === 'python' && <BrythonCommunicator />}
            </DocContext.Provider>
        </div>
    );
});

export default CodeEditorComponent;

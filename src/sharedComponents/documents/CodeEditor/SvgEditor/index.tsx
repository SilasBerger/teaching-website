import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ScriptMeta } from '@tdev-models/documents/Script';
import { MetaProps } from '@tdev/theme/CodeBlock';
import PermissionsPanel from '@tdev-components/PermissionsPanel';
import { useFirstMainDocument } from '@tdev-hooks/useFirstMainDocument';
import CodeEditorComponent from '..';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import CodeBlock from '@theme/CodeBlock';
import Card from '@tdev-components/shared/Card';
import Button from '@tdev-components/shared/Button';
import { extractCodeBlockProps } from '@tdev/theme/CodeBlock/extractCodeBlockProps';
import useIsBrowser from '@docusaurus/useIsBrowser';

export interface Props extends Omit<MetaProps, 'live_jsx' | 'live_py' | 'title'> {
    title?: string;
    code?: string;
    showLineNumbers?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const getInitialCode = (props: Props) => {
    if (props.children) {
        if (typeof props.children === 'string') {
            return props.children; // inline-text
        }
        const codeBlock = extractCodeBlockProps(props.children);
        if (codeBlock && typeof codeBlock.children === 'string') {
            return codeBlock.children; // code-block
        }
    }
    return props.code || '';
};

const SvgEditor = observer((props: Props) => {
    const id = props.slim ? undefined : props.id;
    const [meta] = React.useState(
        new ScriptMeta({ title: 'SVG', ...props, code: getInitialCode(props), lang: 'svg' })
    );
    const doc = useFirstMainDocument(id, meta);
    const isBrowser = useIsBrowser();
    if (!isBrowser || !doc) {
        return <CodeBlock language="svg">{props.code}</CodeBlock>;
    }
    if (!doc.canDisplay && props.id) {
        return (
            <div>
                <PermissionsPanel documentRootId={props.id} />
            </div>
        );
    }

    return (
        <div className={clsx(styles.svgEditor)}>
            <div className={clsx(styles.editor)}>
                <CodeEditorComponent script={doc} className={clsx(styles.code)} />
            </div>
            <Card classNames={{ card: styles.svgCard, body: styles.svgCardBody }}>
                <ErrorBoundary
                    fallback={({ error, tryAgain }) => (
                        <div>
                            <div className={clsx('alert', 'alert--danger')} role="alert">
                                <div>Invalides SVG 😵‍💫: {error.message}</div>
                                Ändere den Code und versuche es erneut 😎.
                                <Button onClick={tryAgain}>Nochmal versuchen</Button>
                            </div>
                        </div>
                    )}
                >
                    <div className={clsx(styles.svgResult)} dangerouslySetInnerHTML={{ __html: doc?.code }} />
                </ErrorBoundary>
            </Card>
        </div>
    );
});

export default SvgEditor;

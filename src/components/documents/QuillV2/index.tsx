import useIsBrowser from '@docusaurus/useIsBrowser';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import type { default as QuillV2Type, Props } from './QuillV2';
import { useFirstMainDocument } from '@site/src/hooks/useFirstMainDocument';
import { default as QuillV2Model, ModelMeta, MetaInit } from '@site/src/models/documents/QuillV2';
import clsx from 'clsx';
import { DocContext } from '../DocumentContext';
import { ToolbarOptions } from '@site/src/models/documents/QuillV2/helpers/toolbar';

/**
 * Lazy load QuillV2 component - this is a workaround for SSR
 * Background: QuillV2 uses react-quilljs which uses Quill.js which uses window.document
 * which is not available in SSR
 *
 * --> dynamic import QuillV2 component when it's needed
 */

export const QuillV2 = observer((props: Props) => {
    const doc = useFirstMainDocument(props.id, new ModelMeta(props));
    return <QuillV2Component quillDoc={doc} {...props} />;
});

type QuillProps = Props & {
    quillDoc: QuillV2Model;
    className?: string;
};

export const QuillV2Component = observer((props: QuillProps) => {
    const [quill, setQuill] = React.useState<{ default: typeof QuillV2Type }>();
    const { quillDoc } = props;
    React.useEffect(() => {
        import('./QuillV2').then((quill) => {
            setQuill(quill);
        });
    }, []);
    if (!useIsBrowser() || !quill || !quillDoc) {
        return <div>{quillDoc.meta.default || quillDoc.meta.placeholder || '✍️ Antwort...'}</div>;
    }

    return (
        <DocContext.Provider value={quillDoc}>
            <quill.default {...props} />
        </DocContext.Provider>
    );
});

export default QuillV2;

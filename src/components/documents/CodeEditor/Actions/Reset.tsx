import * as React from 'react';
import Button from '@site/src/components/documents/CodeEditor/Button';
import { useDocument } from '../../useContextDocument';
import { DocumentType } from '@site/src/api/document';
import { mdiRestore } from '@mdi/js';
import { observer } from 'mobx-react-lite';

const Reset = observer(() => {
    const script = useDocument<DocumentType.Script>();

    const onReset = () => {
        const shouldReset = window.confirm(
            'Änderungen wirklich verwerfen? Dies kann nicht rückgängig gemacht werden.'
        );
        if (shouldReset) {
            script.setCode(script.meta.initCode);
        }
    };
    return (
        <Button onClick={onReset} title={'Code auf ursprünglichen Zustand zurücksetzen'} icon={mdiRestore} />
    );
});

export default Reset;

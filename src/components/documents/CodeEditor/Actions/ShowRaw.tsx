import * as React from 'react';
import Button, { Color } from '@site/src/components/documents/CodeEditor/Button';
import { useDocument } from '../../useContextDocument';
import { DocumentType } from '@site/src/api/document';
import { observer } from 'mobx-react-lite';
import { mdiFileCodeOutline, mdiFileDocumentEditOutline, mdiFileEdit } from '@mdi/js';

const ShowRaw = observer(() => {
    const script = useDocument<DocumentType.Script>();

    return (
        <Button
            icon={script.showRaw ? mdiFileDocumentEditOutline : mdiFileCodeOutline}
            onClick={() => script.setShowRaw(!script.showRaw)}
            color={script.showRaw ? Color.Primary : Color.Secondary}
            title={script.showRaw ? 'Zeige bearbeiteten Code' : 'Zeige ursprünglichen Code'}
        />
    );
});

export default ShowRaw;

import React from 'react';
import { observer } from 'mobx-react-lite';
import DynamicDocumentRoots, { MetaInit } from '@tdev-models/documents/DynamicDocumentRoots';
import { useStore } from '@tdev-hooks/useStore';
import { v4 as uuidv4 } from 'uuid';
import Button from '@tdev-components/shared/Button';
import { mdiPlusCircleOutline } from '@mdi/js';
import { RoomType } from '@tdev-api/document';
import { RWAccess } from '@tdev-models/helpers/accessPolicy';

interface Props extends MetaInit {
    dynamicDocumentRoots: DynamicDocumentRoots;
}

const AddDynamicDocumentRoot = observer((props: Props) => {
    const { dynamicDocumentRoots } = props;
    const userStore = useStore('userStore');
    const user = userStore.current;
    if (!user || !user.isAdmin) {
        return null;
    }

    return (
        <div>
            <Button
                text="Neue Gruppe"
                title='Neue "Document Root" hinzufügen'
                icon={mdiPlusCircleOutline}
                iconSide="left"
                disabled={!RWAccess.has(dynamicDocumentRoots.root?.permission)}
                onClick={() => {
                    const newId = uuidv4();
                    dynamicDocumentRoots.addDynamicDocumentRoot(
                        newId,
                        `Neue Gruppe (${dynamicDocumentRoots.dynamicDocumentRoots.length + 1})`,
                        RoomType.Messages
                    );
                }}
            />
        </div>
    );
});

export default AddDynamicDocumentRoot;

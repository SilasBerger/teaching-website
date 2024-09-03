import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as FileModel } from '@site/src/models/documents/FileSystem/File';
import Icon from '@mdi/react';
import {
    mdiFile,
    mdiFileCode,
    mdiFileCodeOutline,
    mdiFileDocument,
    mdiFileDocumentOutline,
    mdiFileOutline
} from '@mdi/js';
import SyncStatus from '../../../SyncStatus';
import { DocumentType } from '@site/src/api/document';
import CodeEditorComponent from '../../CodeEditor';
import { QuillV2Component } from '../../QuillV2';
import Actions from '../Actions';
import EditableName from '../Directory/EditableName';
import Details from '../Details';

interface Props {
    file: FileModel;
}

const getColor = (type?: DocumentType) => {
    switch (type) {
        case DocumentType.QuillV2:
            return 'var(--ifm-color-blue)';
        case DocumentType.Script:
            return 'rgb(19, 165, 0)';
        default:
            return undefined;
    }
};

const getIcon = (type?: DocumentType) => {
    switch (type) {
        case DocumentType.QuillV2:
            return mdiFileDocumentOutline;
        case DocumentType.Script:
            return mdiFileCodeOutline;
        default:
            return mdiFileOutline;
    }
};

const getOpenIcon = (type?: DocumentType) => {
    switch (type) {
        case DocumentType.QuillV2:
            return mdiFileDocument;
        case DocumentType.Script:
            return mdiFileCode;
        default:
            return mdiFile;
    }
};

const File = observer((props: Props) => {
    const { file } = props;
    return (
        <Details
            model={file}
            className={clsx(styles.file)}
            summary={
                <summary className={clsx(styles.summary)}>
                    <Icon
                        path={file.isOpen ? getOpenIcon(file.document?.type) : getIcon(file.document?.type)}
                        size={0.8}
                        className={clsx(styles.icon)}
                        color={getColor(file.document?.type)}
                    />
                    <EditableName model={file} className={styles.fileName} />
                    <div className={clsx(styles.syncState)}>
                        <SyncStatus model={file} />
                    </div>
                    <div className={clsx(styles.spacer)} />
                    <div className={clsx(styles.actions)}>
                        <Actions item={file} />
                    </div>
                </summary>
            }
        >
            <div className={clsx(styles.content)}>
                {file.document && file.isOpen && (
                    <>
                        {file.document.type === DocumentType.Script && (
                            <CodeEditorComponent script={file.document} />
                        )}
                        {file.document.type === DocumentType.QuillV2 && (
                            <QuillV2Component quillDoc={file.document} className={styles.quill} />
                        )}
                    </>
                )}
            </div>
        </Details>
    );
});

export default File;

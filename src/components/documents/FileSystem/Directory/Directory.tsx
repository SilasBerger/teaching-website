import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import shared from '@tdev-components/documents/FileSystem/shared.module.scss';
import { observer } from 'mobx-react-lite';
import { default as DirctoryModel } from '@tdev-models/documents/FileSystem/Directory';
import Icon from '@mdi/react';
import { mdiFolder, mdiFolderOpen } from '@mdi/js';
import SyncStatus from '@tdev-components/SyncStatus';
import NewItem from '@tdev-components/documents/FileSystem/Directory/NewItem';
import File from '@tdev-components/documents/FileSystem//File';
import Actions from '@tdev-components/documents/FileSystem/Actions';
import Name from '@tdev-components/documents/FileSystem/Name';
import FsDetails from '@tdev-components/documents/FileSystem/FsDetails';

interface Props {
    dir: DirctoryModel;
    isNested?: boolean;
}

const Directory = observer((props: Props) => {
    const { dir } = props;
    return (
        <FsDetails
            model={dir}
            className={clsx(shared.fsItem, styles.dir, props.isNested && styles.isNested)}
            summary={
                <summary className={clsx(shared.summary, styles.summary)}>
                    <Icon
                        path={dir.isOpen ? mdiFolderOpen : mdiFolder}
                        size={0.8}
                        className={clsx(shared.icon)}
                    />
                    <Name model={dir} className={shared.name} />
                    <div className={clsx(shared.syncState)}>
                        <SyncStatus model={dir} />
                    </div>
                    <div
                        className={clsx(shared.actions)}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.bubbles = false;
                        }}
                    >
                        {dir.isOpen && <NewItem directory={dir} />}
                        <Actions item={dir} />
                    </div>
                </summary>
            }
        >
            <div className={clsx(shared.content, styles.content)}>
                {dir.isOpen && (
                    <>
                        {dir.files.map((file) => {
                            return <File key={file.id} file={file} />;
                        })}
                        {dir.directories.map((dir) => {
                            return <Directory key={dir.id} dir={dir} isNested />;
                        })}
                    </>
                )}
            </div>
        </FsDetails>
    );
});

export default Directory;

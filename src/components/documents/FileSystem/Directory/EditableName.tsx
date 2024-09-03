import React from 'react';
import type Directory from '@site/src/models/documents/FileSystem/Directory';
import type File from '@site/src/models/documents/FileSystem/File';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

interface Props {
    model: Directory | File;
    className?: string;
}
const EditableName = observer((props: Props) => {
    const { model } = props;
    return (
        <>
            {model.isEditing ? (
                <input
                    type="text"
                    placeholder="Ordnername..."
                    value={model.name}
                    className={clsx(props.className)}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onDoubleClick={(e) => {
                        e.currentTarget.select();
                    }}
                    onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                            model.saveNow();
                            model.setIsEditing(false);
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        if (e.key === 'Enter') {
                            model.saveNow();
                            model.setIsEditing(false);
                        }
                    }}
                    onChange={(e) => {
                        model.setName(e.target.value);
                    }}
                    onBlur={() => {
                        model.setIsEditing(false);
                    }}
                    autoFocus
                />
            ) : (
                <h4 className={clsx(props.className)}>{model.name}</h4>
            )}
        </>
    );
});

export default EditableName;

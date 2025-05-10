import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { RoomType } from '@tdev-api/document';
import DynamicDocumentRoot from '@tdev-models/documents/DynamicDocumentRoot';

interface Props {
    dynamicRoot: DynamicDocumentRoot;
}

export const RoomTypeLabel: { [key in RoomType]: string } = {
    [RoomType.Messages]: 'Textnachrichten'
};

export const RoomTypeDescription: { [key in RoomType]: string } = {
    [RoomType.Messages]: 'Textnachrichten können in einem Chat versandt- und empfangen werden.'
};

const ValidRoomType = new Set<string>(Object.values(RoomType));

const RoomTypeSelector = observer((props: Props) => {
    const { dynamicRoot } = props;
    const invalidRoomType = !ValidRoomType.has(dynamicRoot.props?.type || '');
    return (
        <div className={clsx(styles.typeSelector)}>
            <select
                className={clsx(styles.select, invalidRoomType && styles.invalid)}
                value={dynamicRoot.props?.type || ''}
                onChange={(e) => {
                    dynamicRoot.setRoomType(e.target.value as RoomType);
                }}
            >
                {invalidRoomType && (
                    <option value={dynamicRoot.props?.type || ''} disabled>
                        {dynamicRoot.props?.type || '-'}
                    </option>
                )}
                {Object.values(RoomType).map((type) => (
                    <option key={type} value={type} title={RoomTypeDescription[type]}>
                        {RoomTypeLabel[type]}
                    </option>
                ))}
            </select>
        </div>
    );
});

export default RoomTypeSelector;

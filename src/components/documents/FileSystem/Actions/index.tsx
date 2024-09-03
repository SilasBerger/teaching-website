import { mdiDotsVerticalCircleOutline, mdiRenameOutline, mdiTrashCan } from '@mdi/js';
import styles from './styles.module.scss';
import Button from '@site/src/components/shared/Button';
import Directory from '@site/src/models/documents/FileSystem/Directory';
import File from '@site/src/models/documents/FileSystem/File';
import { observer } from 'mobx-react-lite';
import Popup from 'reactjs-popup';
import clsx from 'clsx';
import Icon from '@mdi/react';

interface Props {
    item: File | Directory;
}

const Actions = observer((props: Props) => {
    const { item } = props;
    return (
        <>
            <Button
                icon={mdiRenameOutline}
                color="primary"
                size={0.7}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    item.setIsEditing(true);
                }}
            />
            <Popup
                trigger={
                    <span>
                        <Icon path={mdiDotsVerticalCircleOutline} size={0.8} />
                    </span>
                }
                on="hover"
                position={['bottom right']}
                arrow={false}
                offsetX={20}
                offsetY={5}
            >
                <div className={clsx('card', styles.card)}>
                    <div className={clsx('card__body', styles.body)}>
                        <Button
                            text="Löschen"
                            color="red"
                            icon={mdiTrashCan}
                            size={1}
                            onClick={(e) => {
                                item.delete();
                            }}
                        />
                    </div>
                </div>
            </Popup>
        </>
    );
});
export default Actions;

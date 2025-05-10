import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as StudentGroupModel } from '@tdev-models/StudentGroup';
import Button from '../shared/Button';
import { mdiAccountPlus } from '@mdi/js';
import Popup from 'reactjs-popup';
import { useStore } from '@tdev-hooks/useStore';

interface Props {
    studentGroup: StudentGroupModel;
}

const AddUserPopup = observer((props: Props) => {
    const userStore = useStore('userStore');
    const [searchFilter, setSearchFilter] = React.useState('');
    const [searchRegex, setSearchRegex] = React.useState(new RegExp(searchFilter, 'i'));
    React.useEffect(() => {
        setSearchRegex(new RegExp(searchFilter, 'i'));
    }, [searchFilter]);
    const group = props.studentGroup;
    return (
        <Popup
            trigger={
                <div>
                    <Button
                        className={clsx('button--block')}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                        icon={mdiAccountPlus}
                        color="green"
                        text="Hinzufügen"
                        iconSide="left"
                    />
                </div>
            }
            on="click"
            closeOnDocumentClick
            closeOnEscape
        >
            <div className={clsx(styles.wrapper, 'card')}>
                <div className={clsx('card__header', styles.header)}>
                    <h3>Benutzer:in hinzufügen</h3>
                </div>
                <div className={clsx('card__body')}>
                    <input
                        type="text"
                        placeholder="Suche..."
                        value={searchFilter}
                        className={clsx(styles.textInput)}
                        onChange={(e) => {
                            setSearchFilter(e.target.value);
                        }}
                    />
                    <div className={styles.listContainer}>
                        <ul className={clsx(styles.students, styles.list)}>
                            {userStore.users
                                .filter((user) => searchRegex.test(user.searchTerm))
                                .map((user, idx) => (
                                    <li
                                        key={idx}
                                        className={clsx(
                                            styles.listItem,
                                            group.userIds.has(user.id) && styles.disabled
                                        )}
                                        title={user.email}
                                    >
                                        {user.nameShort}
                                        <div className={styles.actions}>
                                            <Button
                                                onClick={() => {
                                                    group.addStudent(user);
                                                }}
                                                disabled={group.userIds.has(user.id)}
                                                icon={mdiAccountPlus}
                                                color="green"
                                            />
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Popup>
    );
});

export default AddUserPopup;

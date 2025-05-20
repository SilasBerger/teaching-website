import styles from './styles.module.scss';
import { mdiAccountPlus } from '@mdi/js';
import { useStore } from '@tdev-hooks/useStore';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { _AddMembersPopupPropsInternal } from './types';
import Button from '@tdev-components/shared/Button';

const AddUser = observer((props: _AddMembersPopupPropsInternal) => {
    const userStore = useStore('userStore');
    const [searchFilter, setSearchFilter] = React.useState('');
    const [searchRegex, setSearchRegex] = React.useState(new RegExp(searchFilter, 'i'));

    React.useEffect(() => {
        setSearchRegex(new RegExp(searchFilter, 'i'));
    }, [searchFilter]);

    const group = props.studentGroup;

    return (
        <>
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
        </>
    );
});

export default AddUser;

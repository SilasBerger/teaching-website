import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/hooks/useStore';
import Button from '../../shared/Button';
import { mdiPlusCircleOutline } from '@mdi/js';
import StudentGroup from '../../StudentGroup';
import _ from 'lodash';

const StudentGroupPanel = observer(() => {
    const userStore = useStore('userStore');
    const groupStore = useStore('studentGroupStore');
    const current = userStore.current;
    if (!current?.isAdmin) {
        return null;
    }
    return (
        <div>
            <Button
                onClick={() => {
                    groupStore.create('Neue Lerngruppe', 'Beschreibung');
                }}
                icon={mdiPlusCircleOutline}
                color="primary"
                text="Neue Lerngruppe erstellen"
            />
            <div className={clsx(styles.studentGroups)}>
                {_.orderBy(
                    groupStore.studentGroups.filter((g) => !g.parentId),
                    ['name', 'createdAt'],
                    ['asc', 'desc']
                ).map((group) => (
                    <StudentGroup key={group.id} studentGroup={group} className={clsx(styles.studentGroup)} />
                ))}
            </div>
        </div>
    );
});

export default StudentGroupPanel;

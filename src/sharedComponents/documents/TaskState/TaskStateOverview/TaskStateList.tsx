import React from 'react';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@tdev-hooks/useStore';
import Icon from '@mdi/react';
import { mdiIcon } from '..';
import TaskState from '@tdev-models/documents/TaskState';
import { mdiColor } from '.';

interface Props {
    taskStates: TaskState[];
}

const TaskStateList = observer((props: Props) => {
    const { taskStates } = props;
    const userStore = useStore('userStore');
    return (
        <>
            {taskStates.map((ts, idx) => (
                <span
                    className={styles.taskState}
                    key={idx}
                    onClick={() => {
                        ts.setScrollTo(true);
                        if (userStore.viewedUserId !== ts.authorId) {
                            userStore.switchUser(ts.authorId);
                        }
                    }}
                >
                    <Icon path={mdiIcon[ts.taskState]} color={`var(${mdiColor[ts.taskState]})`} size={0.8} />
                </span>
            ))}
        </>
    );
});

export default TaskStateList;

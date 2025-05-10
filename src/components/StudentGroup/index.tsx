import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as StudentGroupModel } from '@tdev-models/StudentGroup';
import Button from '@tdev-components/shared/Button';
import {
    mdiAccountKey,
    mdiAccountKeyOutline,
    mdiAccountReactivateOutline,
    mdiCircleEditOutline,
    mdiClose,
    mdiCloseBox,
    mdiCloseCircleOutline,
    mdiContentSave,
    mdiFileExcelOutline,
    mdiTrashCanOutline
} from '@mdi/js';
import { useStore } from '@tdev-hooks/useStore';
import AddUserPopup from './AddUserPopup';
import DefinitionList from '../DefinitionList';
import Details from '@theme/Details';
import { exportAsExcelSpreadsheet } from '@tdev-components/StudentGroup/excelExport';
import { SIZE_S } from '@tdev-components/shared/iconSizes';
import { Confirm } from '@tdev-components/shared/Button/Confirm';

interface Props {
    studentGroup: StudentGroupModel;
    className?: string;
}

const StudentGroup = observer((props: Props) => {
    const [removedIds, setRemovedIds] = React.useState<string[]>([]);
    const userStore = useStore('userStore');
    const groupStore = useStore('studentGroupStore');
    const group = props.studentGroup;
    const isAdmin = group.isGroupAdmin;
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setRemovedIds([]);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [removedIds]);
    return (
        <div className={clsx(styles.studentGroup, props.className, 'card')}>
            <div className={clsx('card__header', styles.header)}>
                <h3>
                    {isAdmin && group.isEditing ? (
                        <input
                            type="text"
                            placeholder="Titel..."
                            value={group.name}
                            className={clsx(styles.textInput)}
                            onChange={(e) => {
                                group.setName(e.target.value);
                            }}
                            autoFocus
                            tabIndex={1}
                            onFocus={(inp) => {
                                inp.target.select();
                            }}
                        />
                    ) : (
                        group.name || '-'
                    )}
                </h3>
                {isAdmin && (
                    <div className={styles.buttons}>
                        <Button
                            icon={mdiFileExcelOutline}
                            onClick={() => exportAsExcelSpreadsheet(group)}
                            color={'green'}
                        />
                        <div>
                            {group.isEditing ? (
                                <>
                                    <Button
                                        onClick={() => {
                                            group.reset();
                                            group.setEditing(false);
                                        }}
                                        icon={mdiCloseCircleOutline}
                                        color="black"
                                        title="Verwerfen"
                                    />
                                    <Button
                                        onClick={() => {
                                            group.save();
                                            group.setEditing(false);
                                        }}
                                        icon={mdiContentSave}
                                        color="green"
                                        title="Speichern"
                                    />
                                    <Confirm
                                        onConfirm={() => {
                                            groupStore.destroy(group);
                                        }}
                                        icon={mdiTrashCanOutline}
                                        color="red"
                                        title="Löschen"
                                        confirmText="Wirklich löschen?"
                                    />
                                </>
                            ) : (
                                <Button
                                    onClick={() => {
                                        group.setEditing(true);
                                    }}
                                    icon={mdiCircleEditOutline}
                                    color="orange"
                                    title="Bearbeiten"
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className={clsx('card__body')}>
                <DefinitionList>
                    <dt>Beschreibung</dt>
                    <dd>
                        {isAdmin && group.isEditing ? (
                            <textarea
                                placeholder="Beschreibung..."
                                value={group.description}
                                className={clsx(styles.textarea)}
                                onChange={(e) => {
                                    group.setDescription(e.target.value);
                                }}
                                tabIndex={2}
                            />
                        ) : (
                            group.description || '-'
                        )}
                    </dd>

                    <dt>Erstellt Am</dt>
                    <dd>{group.fCreatedAt}</dd>

                    <dt>Letzte Änderung</dt>
                    <dd>{group.fUpdatedAt}</dd>
                    <dt>Obergruppe</dt>
                    <dd>
                        {isAdmin && group.isEditing ? (
                            <>
                                <select
                                    tabIndex={3}
                                    value={group.parentId || ''}
                                    onChange={(e) => {
                                        group.setParentId(e.target.value || null);
                                    }}
                                >
                                    <option value="">Keine</option>
                                    {groupStore.managedStudentGroups
                                        .filter((g) => g.id !== group.id)
                                        .map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                </select>
                            </>
                        ) : (
                            <>{group.parentId ? <code>{group.parentId}</code> : '-'}</>
                        )}
                    </dd>

                    <dt>Anzahl Schüler:innen</dt>
                    <dd>
                        <span className={clsx('badge badge--primary')}>
                            {group.students.filter((u) => !u.hasElevatedAccess).length}
                        </span>
                    </dd>
                    <dt>Admins</dt>
                    <dd className={clsx(styles.ddGroup)}>
                        <div className={styles.listContainer}>
                            <ul className={clsx(styles.students, styles.list)}>
                                {group.admins.map((admin, idx) => (
                                    <li key={idx} className={clsx(styles.listItem)}>
                                        {admin.nameShort}
                                        {isAdmin && (
                                            <div className={styles.actions}>
                                                <Confirm
                                                    icon={mdiAccountKey}
                                                    color="red"
                                                    size={SIZE_S}
                                                    title="Admin-Rolle zurückziehen"
                                                    disabled={group.adminIds.size === 1}
                                                    confirmText="Adminrecht entziehen?"
                                                    onConfirm={() => {
                                                        group.setAdminRole(admin, false);
                                                    }}
                                                />
                                                <Confirm
                                                    onConfirm={() => {
                                                        group.removeStudent(admin);
                                                        setRemovedIds([
                                                            ...new Set([...removedIds, admin.id])
                                                        ]);
                                                    }}
                                                    size={SIZE_S}
                                                    confirmText="Admin aus Gruppe entfernen?"
                                                    confirmColor="red"
                                                    icon={mdiClose}
                                                    confirmIcon={mdiCloseBox}
                                                    title={
                                                        group.admins.length === 1
                                                            ? 'Eine Gruppe ohne Admins ist nicht zulässig'
                                                            : 'Entfernen'
                                                    }
                                                    disabled={group.admins.length <= 1}
                                                />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </dd>

                    <dt>Gruppe</dt>
                    <dd className={clsx(styles.ddGroup)}>
                        {isAdmin && <AddUserPopup studentGroup={group} />}
                        <div className={styles.listContainer}>
                            <ul className={clsx(styles.students, styles.list)}>
                                {group.students.map((student, idx) => (
                                    <li key={idx} className={clsx(styles.listItem)}>
                                        {student.nameShort}
                                        {isAdmin && (
                                            <div className={styles.actions}>
                                                <Button
                                                    icon={mdiAccountKeyOutline}
                                                    color="blue"
                                                    size={SIZE_S}
                                                    title="Zum Admin machen"
                                                    onClick={() => {
                                                        group.setAdminRole(student, true);
                                                    }}
                                                />
                                                <Button
                                                    onClick={() => {
                                                        group.removeStudent(student);
                                                        setRemovedIds([
                                                            ...new Set([...removedIds, student.id])
                                                        ]);
                                                    }}
                                                    size={SIZE_S}
                                                    icon={mdiClose}
                                                    color="red"
                                                    title="Entfernen"
                                                />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {removedIds.map((removedId) => (
                            <div
                                className={clsx('alert alert--warning', styles.removeAlert)}
                                role="alert"
                                key={removedId}
                            >
                                <button
                                    aria-label="Close"
                                    className={clsx('clean-btn close')}
                                    type="button"
                                    onClick={() => setRemovedIds(removedIds.filter((id) => id !== removedId))}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                Benutzer:in <strong>{userStore.find(removedId)?.nameShort}</strong> wurde
                                entfernt.
                                <Button
                                    onClick={() => {
                                        const user = userStore.find(removedId);
                                        if (user) {
                                            group.addStudent(user);
                                        }
                                        setRemovedIds(removedIds.filter((id) => id !== removedId));
                                    }}
                                    icon={mdiAccountReactivateOutline}
                                    text="Rückgängig"
                                    className={clsx('button--block')}
                                    iconSide="left"
                                    color="primary"
                                />
                            </div>
                        ))}
                    </dd>
                </DefinitionList>
                {group.children.length > 0 && (
                    <Details
                        summary={
                            <summary className={clsx(styles.childGroupSummary)}>
                                Untergruppen
                                <span className={clsx('badge badge--primary')}>{group.children.length}</span>
                            </summary>
                        }
                    >
                        <div>
                            {group.children.map((child) => (
                                <StudentGroup key={child.id} studentGroup={child} />
                            ))}
                        </div>
                    </Details>
                )}
            </div>
        </div>
    );
});

export default StudentGroup;

import React from 'react';
import clsx from 'clsx';
import styles from '../Permission.module.scss';
import { observer } from 'mobx-react-lite';
import AccessSelector from '../AccessSelector';
import Button from '@tdev-components/shared/Button';
import { mdiAccountSupervisorCircle, mdiDelete } from '@mdi/js';
import { default as GroupPermissionModel } from '@tdev-models/GroupPermission';
import Icon from '@mdi/react';
import { Access } from '@tdev-api/document';

interface Props {
    permission: GroupPermissionModel;
}

const GroupPermission = observer((props: Props) => {
    const { permission } = props;
    return (
        <div className={clsx(styles.permission)}>
            <span className={clsx(styles.audience)}>
                <Icon path={mdiAccountSupervisorCircle} color="var(--ifm-color-primary)" size={0.8} />
                {permission.group?.name || permission.id}
            </span>
            <span className={clsx(styles.spacer)} />
            <AccessSelector
                accessTypes={[Access.RO_StudentGroup, Access.RW_StudentGroup, Access.None_StudentGroup]}
                access={permission.access}
                onChange={(access) => {
                    permission.access = access;
                }}
            />
            <span className={clsx(styles.actions)}>
                <Button
                    onClick={() => {
                        permission.delete();
                    }}
                    color="red"
                    icon={mdiDelete}
                />
            </span>
        </div>
    );
});

export default GroupPermission;

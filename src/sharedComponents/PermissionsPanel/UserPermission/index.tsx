import React from 'react';
import clsx from 'clsx';
import styles from '../Permission.module.scss';
import { observer } from 'mobx-react-lite';
import { default as UserPermissionModel } from '@tdev-models/UserPermission';
import AccessSelector from '../AccessSelector';
import Button from '@tdev-components/shared/Button';
import { mdiAccountCircle, mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';
import { Access } from '@tdev-api/document';

interface Props {
    permission: UserPermissionModel;
}

const UserPermission = observer((props: Props) => {
    const { permission } = props;
    return (
        <div className={clsx(styles.permission)}>
            <span className={clsx(styles.audience)}>
                <Icon path={mdiAccountCircle} color="var(--ifm-color-primary)" size={0.8} />
                {permission.user?.nameShort || permission.id}
            </span>
            <span className={clsx(styles.spacer)} />
            <AccessSelector
                accessTypes={[Access.RO_User, Access.RW_User, Access.None_User]}
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

export default UserPermission;

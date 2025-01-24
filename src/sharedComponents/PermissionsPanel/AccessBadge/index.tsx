import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Access } from '@tdev-api/document';
import Icon from '@mdi/react';
import { ROAccess, RWAccess } from '@tdev-models/helpers/accessPolicy';
import { mdiEye, mdiEyeOff, mdiSquareEditOutline } from '@mdi/js';
const SIZE = 0.8;
const AccessIcon = (access: Access) => {
    if (RWAccess.has(access)) {
        return mdiSquareEditOutline;
    }
    if (ROAccess.has(access)) {
        return mdiEye;
    }
    return mdiEyeOff;
};

interface Props {
    access?: Access;
    defaultAccess?: Access;
    className?: string;
    size?: number;
}

const AccessBadge = observer((props: Props) => {
    return (
        <div className={clsx('badge', 'badge--secondary', styles.accessBadge, props.className)}>
            <Icon
                path={AccessIcon(props.access || props.defaultAccess || Access.None_DocumentRoot)}
                size={props.size || SIZE}
                color="var(--ifm-color-blue)"
            />
        </div>
    );
});

export default AccessBadge;

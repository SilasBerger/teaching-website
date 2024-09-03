import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as UserModel } from '@site/src/models/User';
import CopyBadge from '../../shared/CopyBadge';
import { formatDateTime } from '@site/src/models/helpers/date';

interface Props {
    user: UserModel;
}

const UserTableRow = observer((props: Props) => {
    const { user } = props;
    return (
        <tr className={clsx(styles.user)}>
            <td>{user.email}</td>
            <td>
                <div className={clsx(styles.role, 'button-group')}>
                    {['Admin', 'User'].map((role, idx) => (
                        <button
                            key={idx}
                            className={clsx(
                                'button',
                                'button--sm',
                                user.isAdmin
                                    ? role === 'Admin'
                                        ? 'button--primary'
                                        : 'button--secondary'
                                    : role === 'User'
                                      ? 'button--primary'
                                      : 'button--secondary'
                            )}
                            onClick={() => {
                                user.setAdmin(role === 'Admin');
                            }}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{formatDateTime(user.createdAt)}</td>
            <td>{formatDateTime(user.updatedAt)}</td>
            <td>
                <CopyBadge value={user.id} />
            </td>
        </tr>
    );
});

export default UserTableRow;

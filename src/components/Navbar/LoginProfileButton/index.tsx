import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { mdiAccountCircleOutline, mdiCircle, mdiLogin } from '@mdi/js';
import siteConfig from '@generated/docusaurus.config';
import { ApiState } from '@site/src/stores/iStore';
import { useStore } from '@site/src/hooks/useStore';
import Button from '../../shared/Button';
import Icon from '@mdi/react';
import useIsBrowser from '@docusaurus/useIsBrowser';
const { NO_AUTH } = siteConfig.customFields as { NO_AUTH?: boolean };

const LoginButton = () => {
    return <Button href={'/login'} text="Login" icon={mdiLogin} color="primary" iconSide="left" />;
};

const LoginProfileButton = observer(() => {
    const isBrowser = useIsBrowser();
    const userStore = useStore('userStore');
    const sessionStore = useStore('sessionStore');
    const socketStore = useStore('socketStore');

    if (!isBrowser || !(sessionStore.isLoggedIn || NO_AUTH)) {
        return <LoginButton />;
    }
    return (
        <div className={styles.profileButton}>
            <Button
                text={userStore.viewedUser?.nameShort || 'Profil'}
                icon={mdiAccountCircleOutline}
                iconSide="left"
                apiState={userStore.viewedUser ? ApiState.IDLE : ApiState.SYNCING}
                color="primary"
                href="/user"
                title="Persönlicher Bereich"
            />
            <Icon
                path={mdiCircle}
                size={0.3}
                color={socketStore.isLive ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)'}
                className={clsx(styles.liveIndicator)}
            />
        </div>
    );
});

export default LoginProfileButton;

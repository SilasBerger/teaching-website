import React from 'react';

import { observer } from 'mobx-react-lite';
import Link from '@docusaurus/Link';
import { mdiAccountCircleOutline } from '@mdi/js';
import siteConfig from '@generated/docusaurus.config';
import {useStore} from "@site/src/app/hooks/useStore";
import {ApiState} from "@site/src/app/stores/iStore";
import Button from "@site/src/app/components/shared/Button";
const { NO_AUTH } = siteConfig.customFields as { NO_AUTH?: boolean };

const LoginProfileButton = observer(() => {
    const userStore = useStore('userStore');
    const sessionStore = useStore('sessionStore');
    if (sessionStore.isLoggedIn || NO_AUTH) {
        return (
            <Button
                text={userStore.current?.firstName || 'Profil'}
                icon={mdiAccountCircleOutline}
                iconSide="left"
                apiState={userStore.current ? ApiState.IDLE : ApiState.SYNCING}
                color="primary"
                href="/user"
                title="Persönlicher Bereich"
            />
        );
    }
    return (
        <>
            <div>
                <Link to={'/login'}>Login 🔑</Link>
            </div>
        </>
    );
});

export default LoginProfileButton;

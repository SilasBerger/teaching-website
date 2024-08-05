import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { mdiLogout, mdiRefresh } from '@mdi/js';
import { useMsal } from '@azure/msal-react';
import { useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import siteConfig from '@generated/docusaurus.config';
import {useStore} from "@site/src/app/hooks/useStore";
import Button from "@site/src/app/components/shared/Button";
import Loader from "@site/src/app/components/Loader";
const { NO_AUTH } = siteConfig.customFields as { TEST_USERNAME?: string; NO_AUTH?: boolean };

const UserPage = observer(() => {
    const sessionStore = useStore('sessionStore');
    const userStore = useStore('userStore');
    const isAuthenticated = useIsAuthenticated();
    const { inProgress } = useMsal();
    if (
        !NO_AUTH &&
        ((sessionStore.currentUserId && !sessionStore.isLoggedIn) || inProgress !== InteractionStatus.None)
    ) {
        return <Loader />;
    }
    if (!NO_AUTH && !(sessionStore.isLoggedIn || isAuthenticated)) {
        return <Redirect to={'/login'} />;
    }
    return (
      <main className={clsx(styles.main)}>
          <Button
            onClick={() => sessionStore.logout()}
            text="Logout"
            title="User Abmelden"
            color="red"
            icon={mdiLogout}
            iconSide="left"
            noOutline
            className={clsx(styles.logout)}
          />
      </main>
    );
});
export default UserPage;

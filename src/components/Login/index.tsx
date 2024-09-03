import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Link from '@docusaurus/Link';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import siteConfig from '@generated/docusaurus.config';
import Translate from '@docusaurus/Translate';
import {useStore} from "@site/src/hooks/useStore";
import {tokenRequest} from "@site/src/authConfig";
const { NO_AUTH } = siteConfig.customFields as { NO_AUTH?: boolean };

const LoginPage = observer(() => {
  const sessionStore = useStore('sessionStore');
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated || NO_AUTH) {
    console.log('redirect');
    return <Redirect to={'/user'} />;
  }
  return (
    <div className={clsx(styles.loginPage)}>
      <Link
        to="/static"
        onClick={() => instance.acquireTokenRedirect(tokenRequest)}
        className="button button--warning"
        style={{color: 'black'}}
      >
        <Translate
          id="login.button.with.school.account.text"
          description="the text of the button login with school account"
        >
          Login mit Schul-Account
        </Translate>
      </Link>
    </div>
  );
});

const Login = observer(() => {
  const sessionStore = useStore('sessionStore');
  if (sessionStore.isLoggedIn || NO_AUTH) {
    console.log('redirect');
    return <Redirect to={'/user'}/>;
  }
  return <LoginPage/>;
});
export default Login;

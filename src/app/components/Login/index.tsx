import styles from "./styles.module.scss";
import {useMsal} from "@azure/msal-react";
import {tokenRequest} from "@site/src/authConfig";

const Login = () => {

  const { instance } = useMsal();

  return (
    <div className={styles.loginHero}>
      <div className={styles.body}>
        <button
          className="button button--warning"
          onClick={() => instance.acquireTokenRedirect(tokenRequest)}>
          Login mit Schul-Account
        </button>
      </div>
    </div>
  );
};

export default Login;

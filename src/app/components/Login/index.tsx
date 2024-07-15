import styles from "./styles.module.scss";
import {useMsal} from "@azure/msal-react";
import {tokenRequest} from "@site/src/authConfig";
import {useStore} from "@site/src/app/hooks/useStore";

const Login = () => {

  const { instance } = useMsal();
  const store = useStore("userStore");

  return (
    <div className={styles.loginHero}>
      {!!store?.current &&
        <div>
          Angemeldet als {store.current.firstName} {store.current.lastName} ({store.current.email})
        </div>
      }
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

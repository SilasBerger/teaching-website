import styles from "./styles.module.scss";
import {LoginStrategy} from "@site/src/app/components/Login/model";
import LoginLanding from "@site/src/app/components/Login/LoginLanding";
import {useState} from "react";
import EmailLogin from "@site/src/app/components/Login/EmailLogin";
import clsx from "clsx";

export interface Props {
  loginStrategies: LoginStrategy[];
}

const Login = ({loginStrategies}: Props) => {
  const loginViaEmail = <EmailLogin />
  const loginLanding = <LoginLanding
    loginStrategies={loginStrategies}
    onLoginViaEmail={() => setStep(loginViaEmail)} />
  const [step, setStep] = useState<React.JSX.Element>(loginLanding);
  const [showBackButton, setShowBackButton] = useState(false);

  return (
    <div className={styles.loginHero}>
      <div className={styles.header}>
        {showBackButton && <button className={styles.backButton} onClick={() => setStep(loginLanding)}>
          <i className={clsx("mdi", "mdi-arrow-left")}></i>
        </button>}
      </div>
      <div className={styles.body}>
        {step}
      </div>
    </div>
  );
};

export default Login;

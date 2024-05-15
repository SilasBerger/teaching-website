import styles from "./styles.module.scss";
import {LoginStrategy} from "@site/src/app/components/Login/model";
import LoginLanding from "@site/src/app/components/Login/LoginLanding";
import {useState} from "react";
import EmailLogin from "@site/src/app/components/Login/EmailLogin";

const placeholder = <div></div>;

export interface Props {
  loginStrategies: LoginStrategy[];
}

const Login = ({loginStrategies}: Props) => {
  const loginViaEmail = <EmailLogin />
  const loginLanding = <LoginLanding
    loginStrategies={loginStrategies}
    onLoginViaEmail={() => setStep(loginViaEmail)} />
  const [step, setStep] = useState<React.JSX.Element>(loginLanding);

  return (
    <div>
      {step}
    </div>
  );
};

export default Login;

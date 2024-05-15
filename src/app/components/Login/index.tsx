import styles from "./styles.module.scss";
import {LoginStrategy} from "@site/src/app/components/Login/model";
import LoginLanding from "@site/src/app/components/Login/LoginLanding";

export interface Props {
  loginStrategies: LoginStrategy[];
}

const Login = ({loginStrategies}: Props) => {
  return (
    <div>
      <LoginLanding loginStrategies={loginStrategies} />
    </div>
  );
};

export default Login;

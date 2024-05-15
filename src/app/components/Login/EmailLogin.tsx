import styles from "./styles.module.scss";
import clsx from "clsx";

const EmailLogin = () => {
  return (
    <div className={styles.inputFields}>
      <label htmlFor="input-email">E-Mail:</label>
      <input id="input-email" type="text" placeholder="E-Mail"/>
      <label htmlFor="input-password">Passwort</label>
      <input id="input-password" type="password" placeholder="Passwort"/>
      <button className={clsx('button', 'button--primary')}>Login</button>
    </div>
  );
}

export default EmailLogin;

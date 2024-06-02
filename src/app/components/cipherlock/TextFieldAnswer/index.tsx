import styles from "./styles.module.scss";
import clsx from "clsx";

const TextFieldAnswer = () => {

  /*
  TODO:
    - Do check-in (gameId and playerId if required)
    - If check-in fails, probably forward to onboarding page
    - If check-in succeeds enable answer
    - On button click, disable answer and send check-request
    - If check-request fails, show failure animation and re-enable answer
    - If check-in request succeeds:
    - Show success animation
    - Show leaderboard (if not always active)
    - If last question: Forward to summary / leaderboard page (or provide a button)
   */

  return (
    <div className={styles.container}>
      <input type="text" placeholder='Antwort...'/>
      <button className={clsx('button', 'button--primary')}>Prüfen</button>
    </div>
  );
}

export default TextFieldAnswer;

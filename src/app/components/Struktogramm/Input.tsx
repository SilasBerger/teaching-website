import styles from './styles.module.scss';
import clsx from "clsx";

interface Props {
  text: string;
}

const Input = ({text}: Props) => {
  return (
    <div className={clsx(styles.Output)}>{text}</div>
  );
}

export default Input;
import styles from './styles.module.scss';
import clsx from "clsx";

interface Props {
  text: string;
}

const Output = ({text}: Props) => {
  return (
    <div className={clsx(styles.Output)}>{text}</div>
  );
}

export default Output;
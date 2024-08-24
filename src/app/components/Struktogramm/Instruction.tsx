import styles from './styles.module.scss';
import clsx from "clsx";

interface Props {
  text: string;
}

const Instruction = ({text}: Props) => {
  return (
    <div className={clsx(styles.Instruction)}>{text}</div>
  );
}

export default Instruction;
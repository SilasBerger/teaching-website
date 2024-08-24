import styles from './styles.module.scss';
import clsx from "clsx";

interface Props {
  code: React.ReactNode;
}

const Output = ({code}: Props) => {
  return (
    <div className={clsx(styles.Output)}>{code}</div>
  );
}

export default Output;
import styles from './styles.module.scss';
import clsx from "clsx";

interface Props {
  code: string,
  children: React.ReactNode | React.ReactNode[];
}

const Loop = ({code, children}: Props) => {
  return (
    <div className={clsx(styles.Loop)}>
      <div className={styles.condition}>{code}</div>
      <div>{children}</div>
    </div>
  );
}

export default Loop;
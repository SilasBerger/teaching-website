import styles from './styles.module.scss';
import clsx from "clsx";

interface Props {
  children: React.ReactNode | React.ReactNode[];
  condition: string,
}

const Loop = ({condition, children}: Props) => {
  return (
    <div className={clsx(styles.Loop)}>
      <div className={styles.condition}>{condition}</div>
      <div>{children}</div>
    </div>
  );
}

export default Loop;
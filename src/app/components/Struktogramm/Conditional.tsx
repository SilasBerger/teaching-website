import styles from './styles.module.scss';
import clsx from "clsx";

interface Props {
  code: string;
  truePath: React.ReactNode | React.ReactNode[];
  falsePath: React.ReactNode | React.ReactNode[];
}

const Conditional = ({code, truePath, falsePath}: Props) => {
  return (
    <div className={clsx(styles.Conditional)}>
      <div className={styles.header}>
        <svg className={styles.triangle} viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="50" y2="100" stroke="black" stroke-width="0.4"/>
          <line x1="100" y1="0" x2="50" y2="100" stroke="black" stroke-width="0.4"/>
        </svg>

        <div className={styles.condition}>{code}</div>

        <div className={styles.corners}>
          <div className={clsx(styles.corner, styles.left)}>wahr</div>
          <div className={clsx(styles.corner, styles.right)}>falsch</div>
        </div>
      </div>

      <div className={styles.paths}>
        <div className={styles.path}>{truePath}</div>
        <div className={styles.path}>{falsePath}</div>
      </div>
    </div>
  );
}

export default Conditional;
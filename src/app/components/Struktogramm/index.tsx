import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const Struktogramm = ({children}: Props) => {
  return (
    <div className={styles.Struktogramm}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}

export default Struktogramm;
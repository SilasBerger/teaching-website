import styles from './styles.module.scss';

interface Props {
  align?: 'flex-start' | 'center' | 'flex-end';
  children: React.ReactNode | React.ReactNode[];
}

const Struktogramm = ({align, children}: Props) => {
  return (
    <div className={styles.Struktogramm} style={{alignItems: align || 'flex-start'}}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}

export default Struktogramm;
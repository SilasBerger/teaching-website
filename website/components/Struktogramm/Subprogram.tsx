import { Bar } from 'recharts';
import styles from './styles.module.scss';
import clsx from 'clsx';

interface Props {
    code: React.ReactNode;
}

const Instruction = ({ code }: Props) => {
    return (
        <div className={clsx(styles.Subprogram)}>
            <div className={clsx(styles.bar, styles.leftBar)}> </div>
            <div className={styles.content}>{code}</div>
            <div className={clsx(styles.bar, styles.rightBar)}> </div>
        </div>
    );
};

export default Instruction;

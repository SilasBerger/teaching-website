import styles from './styles.module.scss';
import clsx from 'clsx';

interface Props {
    code: React.ReactNode;
}

const Instruction = ({ code }: Props) => {
    return <div className={clsx(styles.Instruction)}>{code}</div>;
};

export default Instruction;

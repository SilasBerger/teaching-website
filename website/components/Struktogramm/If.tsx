import styles from './styles.module.scss';
import clsx from 'clsx';

interface Props {
    code: React.ReactNode;
    children: React.ReactNode | React.ReactNode[];
}

const If = ({ code, children }: Props) => {
    return (
        <div className={clsx(styles.If)}>
            <div className={styles.condition}>{code}</div>
            <div className={styles.bottom}>
                <div className={styles.padding}></div>
                <div className={styles.childrenContainer}>{children}</div>
            </div>
        </div>
    );
};

export default If;

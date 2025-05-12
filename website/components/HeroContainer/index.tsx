import styles from './styles.module.scss';
import { ReactNode } from 'react';

export interface Props {
    children?: ReactNode;
}

export default ({ children }: Props) => {
    return <div className={styles.heroContainer}>{children}</div>;
};

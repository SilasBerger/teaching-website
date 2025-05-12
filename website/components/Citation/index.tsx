import React from 'react';
import styles from './styles.module.scss';

export interface Props {
    children?: React.ReactNode;
}

export default ({ children }: Props) => {
    return <span className={styles.citation}>— {children}</span>;
};

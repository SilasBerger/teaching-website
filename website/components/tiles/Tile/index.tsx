import { ReactNode } from 'react';
import styles from './styles.module.scss';

interface TileProps {
    title: string;
    href?: string;
    children: ReactNode;
}

export default ({ title, href, children }) => {
    const tileContent = (
        <div className={`${styles.tile}`}>
            <div className={styles.tileTitle}>{title}</div>
            <div className={styles.tileBody}>{children}</div>
        </div>
    );

    if (href) {
        return (
            <a href={href} className={styles.linkWrapper}>
                {tileContent}
            </a>
        );
    }

    return tileContent;
};

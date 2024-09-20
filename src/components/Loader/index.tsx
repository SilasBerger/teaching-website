import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';

interface Props {
    label?: string;
    overlay?: boolean;
    size?: number;
    className?: string;
    noLabel?: boolean;
    title?: string;
    align?: 'center' | 'left' | 'right';
}

const Loader = (props: Props) => {
    return (
        <div
            className={clsx(
                styles.loader,
                props.className,
                props.overlay && styles.overlay,
                props.align && styles[props.align]
            )}
            title={props.title}
        >
            <Icon path={mdiLoading} spin size={props.size || 1} className={styles.icon} />
            {!props.noLabel && (
                <span className={clsx('badge', styles.badge)}>{props.label || 'Laden...'}</span>
            )}
        </div>
    );
};

export default Loader;

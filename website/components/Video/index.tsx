import React from 'react';
import styles from './styles.module.scss';

import clsx from 'clsx';
import Icon from '@mdi/react';
import { mdiWindowMinimize } from '@mdi/js';

interface Props {
    src: string;
    type?: 'mp4';
    title?: string | JSX.Element;
    expanded?: boolean;
    children?: string | JSX.Element;
}

const Video = (props: Props) => {
    const [open, setOpen] = React.useState(!!props.expanded);

    return (
        <div className={styles.videoComponent}>
            {open ? (
                <div className={styles.cardOpen}>
                    <div className={styles.headerOpen}>
                        {props.title && <h5 className={styles.title}>{props.title}</h5>}
                        {!props.expanded && (
                            <button
                                className={clsx(
                                    'button button--sm button--outline button--secondary',
                                    styles.minimize
                                )}
                                onClick={() => {
                                    setOpen(!open);
                                }}
                            >
                                <Icon path={mdiWindowMinimize} size={1} />
                            </button>
                        )}
                        {props.children && <div className={styles.description}>{props.children}</div>}
                    </div>
                    <video controls autoPlay width="100%" loop preload="none">
                        <source src={props.src} type={`video/${props.type || 'mp4'}`} />
                    </video>
                </div>
            ) : (
                <button
                    className={clsx(
                        'button button--block button--outline button--secondary',
                        styles.wrapButton
                    )}
                    onClick={() => {
                        setOpen(!open);
                    }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}
                >
                    <div className={styles.headerClosed}>
                        <div className={styles.title}>{props.title || 'Video'}</div>
                        {props.children && <div className={styles.description}>{props.children}</div>}
                    </div>
                    <video style={{ marginLeft: 'auto' }} autoPlay controls height="150px" loop>
                        <source src={props.src} type={`video/${props.type || 'mp4'}`} />
                    </video>
                </button>
            )}
        </div>
    );
};
export default Video;

import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme-original/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import styles from './styles.module.scss';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import clsx from 'clsx';
import Icon from '@mdi/react';
import { mdiOpenInNew } from '@mdi/js';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
    const { frontMatter } = useDoc();
    const { sidebar_custom_props } = frontMatter as {
        sidebar_custom_props: { source?: { name: string; ref?: string } };
    };
    return (
        <div className={styles.footer}>
            <div className={styles.sources}>
                {sidebar_custom_props?.source && (
                    <>
                        {sidebar_custom_props.source?.name && (
                            <a
                                href={sidebar_custom_props.source?.ref || '#'}
                                className={clsx(styles.copyright, 'badge', 'badge--secondary')}
                                target="_blank"
                            >
                                {sidebar_custom_props.source?.name}
                                {sidebar_custom_props.source?.ref && (
                                    <Icon path={mdiOpenInNew} style={{ marginLeft: '0.3em' }} size={0.6} />
                                )}
                            </a>
                        )}
                        <i className={clsx(styles.copyright, 'badge', 'badge--secondary')}>Bearbeitet</i>
                    </>
                )}
                <a
                    className={clsx(styles.copyright, 'badge', 'badge--secondary')}
                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de"
                    target="_blank"
                >
                    CC 4.0
                    <Icon path={mdiOpenInNew} style={{ marginLeft: '0.3em' }} size={0.6} />
                </a>
            </div>
            <Footer {...props} />
        </div>
    );
}

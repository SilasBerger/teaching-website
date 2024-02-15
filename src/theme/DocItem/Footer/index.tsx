import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme-original/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import styles from './style.module.scss';
import { useDoc } from '@docusaurus/theme-common/internal';
import clsx from 'clsx';
import {SidebarCustomProps} from "@site/src/shared/models/sidebar-custom-props";

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
    const { frontMatter } = useDoc();
    const sidebar_custom_props: SidebarCustomProps = frontMatter.sidebar_custom_props;
    return (
        <div className={styles.footer}>
            <div className={styles.sources}>
                {sidebar_custom_props?.source && (
                    <>
                        {sidebar_custom_props.source?.name && (
                            <a
                                href={(sidebar_custom_props.source as any)?.ref || '#'}
                                className={clsx(styles.copyright, 'badge', 'badge--secondary')}
                                target={(sidebar_custom_props.source as any)?.ref ? "_blank" : "_self"}
                            >
                                {sidebar_custom_props.source?.name}
                                {sidebar_custom_props.source?.ref && (
                                    <i className="mdi mdi-open-in-new" style={{ marginLeft: '0.3em' }}></i>
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
                    <i className="mdi mdi-open-in-new" style={{ marginLeft: '0.3em' }}></i>
                </a>
            </div>
            <Footer {...props} />
        </div>
    );
}

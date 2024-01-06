/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Adapted from: https://github.com/lebalz/ofi-blog
 */

import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

export enum Browser {
  EDGE = 'edge',
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  SAFARI = 'safari',
}

interface Props {
  url: string;
  minHeight?: number;
  browser?: Browser;
  copy?: boolean;
  children?: ReactNode;
}

const ICONS: { [key in Browser]: string } = {
  chrome: 'mdi-google-chrome',
  edge: 'mdi-microsoft-edge',
  firefox: 'mdi-firefox',
  safari: 'mdi-apple-safari'
}

const COLOR: { [key in Browser]: string } = {
  chrome: 'blue',
  edge: 'cyan',
  firefox: 'orange',
  safari: 'blue'
}
type CopyState = 'spin' | 'copied' | 'error';

const CopyIcon: { [key in CopyState]: string } = {
  copied: 'mdi-clipboard-check',
  error: 'mdi-clipboard-text-off',
  spin: 'mdi-loading'
}

const CopyColor: { [key in CopyState]: string } = {
  copied: 'green',
  error: 'red',
  spin: 'black'
}

export default function BrowserWindow({
  children,
  minHeight,
  copy,
  url = 'http://localhost:3000',
  browser
}: Props): JSX.Element {
  const [copyState, setCopyState] = React.useState<CopyState | 'none'>('none');

  React.useEffect(() => {
    if (['none', 'spin', 'ready'].includes(copyState)) {
      return;
    }
    const timeoutId = setTimeout(() => setCopyState('none'), 2000);
    return () => clearTimeout(timeoutId);
  }, [copyState]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!copy) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setCopyState('spin');
    try {
      navigator.clipboard.writeText(url).then(() => {
        setCopyState('copied');
      })
        .catch((err) => {
          setCopyState('error');
          console.warn(err);
        });
    } catch (err) {
      console.warn(err);
      setCopyState('error');
    }
  }
  return (
    <div className={styles.browserWindow} style={{ minHeight }}>
      <div className={styles.browserWindowHeader}>
        <div className={styles.buttons}>
          <span className={styles.dot} style={{ background: '#f25f58' }} />
          <span className={styles.dot} style={{ background: '#fbbe3c' }} />
          <span className={styles.dot} style={{ background: '#58cb42' }} />
        </div>
        <div className={clsx(styles.browserWindowAddressBar, 'text--truncate')}>
          {browser && (
            <i className={clsx('mdi', ICONS[browser], COLOR[browser], styles.browserType)} />
          )}
          <a href={url} target="_blank" onClick={onClick}>{url}</a>
          {copyState !== 'none' && (
            <>
              <div className={styles.spacer} />
              <i className={clsx('mdi', CopyIcon[copyState], CopyColor[copyState], styles.copyState)} />
            </>
          )}
        </div>
        <div className={styles.browserWindowMenuIcon}>
          <div>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        </div>
      </div>

      <div className={styles.browserWindowBody}>{children}</div>
    </div>
  );
}

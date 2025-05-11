/**
 * Adapted from: https://github.com/lebalz/ofi-blog
 */

import React from 'react';
import styles from './styles.module.scss';

interface Props {
  children?: React.ReactNode;
}

export default function DefinitionList(props: Props) {
  return (
    <dl className={styles.definitionList}>
      {props.children}
    </dl>
  );
}

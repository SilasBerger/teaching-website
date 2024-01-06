import React, {Children, ReactNode} from "react";
import styles from "./Tabs.module.scss";
import clsx from "clsx";

export interface Props {
  children?: React.ReactNode // TODO: Type to <Tab>
}

interface TabElement {
  title: string;
  node: ReactNode;
}

export default function ({children}: Props): React.ReactNode {
  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeader}>
        <button className={styles.tab}>TBD</button>
      </div>
      <div className={styles.tabBody}>
        Here is some text about macOS.
      </div>
    </div>
  );
};

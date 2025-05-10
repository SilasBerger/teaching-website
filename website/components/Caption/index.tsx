import React, {ReactNode} from "react";
import styles from "./styles.module.scss";

export interface Props {
  children?: ReactNode,
}

export default ({children}: Props) => {
  return (
    <div className={styles.sourceReference}>
      {children}
    </div>
  );
};

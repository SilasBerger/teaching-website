import {ReactNode} from "react";
import styles from "./Caption.module.scss";

export interface Props {
  children?: ReactNode,
}

export const Caption = ({children}: Props) => {
  return (
    <div className={styles.sourceReference}>
      {children}
    </div>
  );
};

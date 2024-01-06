import {ReactNode} from "react";
import styles from "./SourceReference.module.scss";

export interface Props {
  children?: ReactNode,
}

export const SourceReference = ({children}: Props) => {
  return (
    <div className={styles.sourceReference}>
      {children}
    </div>
  );
};

import styles from "./HeroContainer.module.scss";
import {ReactNode} from "react";

export interface Props {
  children?: ReactNode;
}

export const HeroContainer = ({children}: Props) => {
  return (
    <div className={styles.heroContainer}>
      { children }
    </div>
  );
}

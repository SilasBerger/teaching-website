import {ReactNode} from "react";
import styles from "./Tiles.module.css";

interface TilesProps {
  children: ReactNode;
}

export const Tiles: React.FC<TilesProps> = ({ children }) => {
  return <div className={styles.tileGrid}>{children}</div>;
};

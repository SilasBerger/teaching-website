import {ReactNode} from "react";
import styles from "./TileGrid.module.scss";

export enum Layout {
  LARGE_TILES = 1,
  MEDIUM_TILES,
  SMALL_TILES,
}

interface TilesProps {
  children: ReactNode;
  layout?: Layout;
  preventGrowOnHover?: boolean;
}

export const TileGrid: React.FC<TilesProps> = ({ children, layout, preventGrowOnHover }) => {
  let layoutClass: string;
  if (layout) {
    switch (layout) {
      case Layout.LARGE_TILES:
        layoutClass = styles.largeTiles;
        break;
      case Layout.MEDIUM_TILES:
        layoutClass = styles.mediumTiles;
        break;
      case Layout.SMALL_TILES:
        layoutClass = styles.smallTiles;
        break;
    }
  } else {
    layoutClass = styles.mediumTiles;
  }

  return (
    <div className={`${styles.tileGrid} ${layoutClass} ${preventGrowOnHover ? '' : styles.growOnHover}`}>
      {children}
    </div>
  );
};

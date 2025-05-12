import { ReactNode } from 'react';
import styles from './styles.module.scss';

export enum Layout {
    LARGE_TILES = 'large',
    MEDIUM_TILES = 'medium',
    SMALL_TILES = 'small',
    FULL_WIDTH = 'full-width'
}

interface TilesProps {
    children: ReactNode;
    layout?: Layout;
    preventGrowOnHover?: boolean;
}

export default ({ children, layout, preventGrowOnHover }) => {
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
            case Layout.FULL_WIDTH:
                layoutClass = styles.fullWidthTiles;
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

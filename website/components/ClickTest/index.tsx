import Icon from '@mdi/react';
import styles from './styles.module.scss';
import { mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline } from '@mdi/js';
import React from 'react';

interface ClickAchievementProps {
    title: string;
    checked: boolean;
}

const ClickAchievement = ({ title, checked }: ClickAchievementProps) => {
    return (
        <div className={styles.clickAchievement}>
            <span className={styles.iconSpan}>
                {checked ? (
                    <Icon
                        className={styles.achievementIcon}
                        path={mdiCheckboxMarkedOutline}
                        color="var(--ifm-color-success)"
                        size={1}
                    />
                ) : (
                    <Icon
                        className={styles.achievementIcon}
                        path={mdiCheckboxBlankOutline}
                        color="var(--ifm-color-warning)"
                        size={1}
                    />
                )}{' '}
            </span>
            <span>{title}</span>
        </div>
    );
};

const ClickTest = () => {
    const DOUBLE_CLICK_DELAY = 1000;

    const [singleClickChecked, setSingleClickChecked] = React.useState(false);
    const [doubleClickChecked, setDoubleClickChecked] = React.useState(false);
    const [rightClickChecked, setRightClickChecked] = React.useState(false);

    const [timeSingleClickRegistered, setTimeSingleClickRegistered] = React.useState(0);
    const [singleClickFrozen, setSingleClickFrozen] = React.useState(false);

    const handleClick = () => {
        setSingleClickChecked(true);

        const now = Date.now();
        const timeSinceSingleClick = now - timeSingleClickRegistered;
        if (timeSingleClickRegistered > 0 && timeSinceSingleClick > DOUBLE_CLICK_DELAY) {
            setSingleClickFrozen(true);
            console.log('Frozen', timeSingleClickRegistered);
        } else {
            setTimeSingleClickRegistered(now);
        }
    };

    const handleDoubleClick = () => {
        setDoubleClickChecked(true);

        const timeSinceSingleClick = Date.now() - timeSingleClickRegistered;
        if (!singleClickFrozen && timeSinceSingleClick < DOUBLE_CLICK_DELAY) {
            setSingleClickChecked(false);
        }
    };

    const handleRightClick = (e: any) => {
        e.preventDefault();
        setRightClickChecked(true);
    };

    return (
        <div className={styles.container}>
            <div
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onContextMenu={handleRightClick}
                className={styles.clickArea}
            >
                Hier klicken!
            </div>
            <div className={styles.clickAchievements}>
                <ClickAchievement title="Klick (Linksklick)" checked={singleClickChecked} />
                <ClickAchievement title="Doppelklick" checked={doubleClickChecked} />
                <ClickAchievement title="Rechtsklick" checked={rightClickChecked} />
            </div>
        </div>
    );
};

export default ClickTest;

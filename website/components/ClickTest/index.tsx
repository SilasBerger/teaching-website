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
            <span>
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
    const [clickChecked, setClickChecked] = React.useState(false);
    const [doubleClickChecked, setDoubleClickChecked] = React.useState(false);
    const [rightClickChecked, setRightClickChecked] = React.useState(false);

    const handleClick = () => {
        setClickChecked(true);
    };

    const handleDoubleClick = () => {
        setDoubleClickChecked(true);
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
            <div>
                <ClickAchievement title="Klick (Linksklick)" checked={clickChecked} />
                <ClickAchievement title="Doppelklick" checked={doubleClickChecked} />
                <ClickAchievement title="Rechtsklick" checked={rightClickChecked} />
            </div>
        </div>
    );
};

export default ClickTest;

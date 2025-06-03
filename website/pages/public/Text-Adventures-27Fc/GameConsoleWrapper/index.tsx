import React from 'react';
import stlyes from './styles.module.scss';
import Terminal, { TerminalProps } from '@tdev-components/Terminal';
import { mdiPlay } from '@mdi/js';
import Button from '@tdev-components/shared/Button';

const GameConsoleWrapper = (props: TerminalProps) => {
    const [started, setStarted] = React.useState(false);

    return (
        <div className={stlyes.wrapper}>
            {started && <Terminal {...props} onClose={() => setStarted(false)} />}
            {!started && (
                <div className={stlyes.placeholder}>
                    <Button
                        icon={mdiPlay}
                        color="green"
                        text="Spiel starten"
                        iconSide="left"
                        onClick={() => setStarted(true)}
                    />
                </div>
            )}
        </div>
    );
};

export default GameConsoleWrapper;

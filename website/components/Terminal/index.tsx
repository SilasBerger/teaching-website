import React, { useRef, useState } from 'react';
import styles from './styles.module.scss';
import Button from '@tdev-components/shared/Button';
import { mdiReplay } from '@mdi/js';

export type ConsoleApi = {
    print: (msg?: string) => void;
    input: (prompt: string) => Promise<string>;
};

type ConsoleProps = {
    run: (api: ConsoleApi) => Promise<void> | void;
};

export const Console: React.FC<ConsoleProps> = ({ run }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [inputPrompt, setInputPrompt] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const inputResolve = useRef<(value: string) => void>(null);

    const print = (msg?: string) => setLines((prev) => [...prev, msg ?? '']);

    const input = (prompt: string) => {
        setInputPrompt(prompt);
        return new Promise<string>((resolve) => {
            inputResolve.current = resolve;
        });
    };

    const handleInput = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputPrompt && inputResolve.current) {
            print(`${inputPrompt}${inputValue}`);
            setInputPrompt(null);
            inputResolve.current(inputValue);
            setInputValue('');
        }
    };

    // Expose a run button for replay
    const handleRun = () => {
        setLines([]);
        setInputPrompt(null);
        setInputValue('');
        setTimeout(() => run({ print, input }), 0);
    };

    React.useEffect(() => {
        handleRun();
        // eslint-disable-next-line
    }, []);

    return (
        <div className={styles.console}>
            <div>
                {lines.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
                {inputPrompt && (
                    <form onSubmit={handleInput} className={styles.inputForm}>
                        <span>{inputPrompt}</span>
                        <input
                            autoFocus
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className={styles.input}
                        />
                    </form>
                )}
            </div>
            <Button
                icon={mdiReplay}
                onClick={() => handleRun()}
                className={styles.restartButton}
                color="red"
            />
        </div>
    );
};

export default Console;

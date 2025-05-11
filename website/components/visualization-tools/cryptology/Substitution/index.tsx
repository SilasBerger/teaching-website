import clsx from 'clsx';
import * as React from 'react';
import styles from '../styles.module.scss';
import { differenceWith, isEqual, keys, shuffle, uniq, update } from 'lodash';
import { useStore } from '@tdev/hooks/useStore';
import { action } from 'mobx';
import { trackDerivedFunction } from 'mobx/dist/internal';
const ALPHABET = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
];

const sanitizer = (text: string) => {
    return text.toUpperCase().replace(/\s+/g, ' ');
};

const sanitizeKey = (key: string) => {
    return key.toUpperCase().replace(/[^A-Z ]/g, '');
};

export default () => {
    const [text, setText] = React.useState('');
    const [key, setKey] = React.useState(ALPHABET.join(''));
    const [missingChars, setMissingChars] = React.useState(ALPHABET);
    const [duplicatedChars, setDuplicatedChars] = React.useState(ALPHABET);
    const [cipherText, setCipherText] = React.useState('');
    const [source, setSource] = React.useState<'text' | 'cipher'>('text');
    const [keySource, setKeySource] = React.useState<'basic' | 'advanced'>('basic');
    const store = useStore('siteStore').toolsStore;
    const [keyTable, setKeyTable] = React.useState<{ [key: string]: string }>({});

    React.useEffect(() => {
        setText(store.substitution?.text || '');
        setKey(store.substitution?.key || ALPHABET.join(''));
        setMissingChars(store.substitution?.missingChars || ALPHABET);
        setDuplicatedChars(store.substitution?.duplicatedChars || ALPHABET);
        setCipherText(store.substitution?.cipherText || '');
        setSource(store.substitution?.source || 'text');
    }, []);

    React.useEffect(() => {
        return action(() => {
            store.substitution = {
                text,
                key,
                missingChars,
                duplicatedChars,
                cipherText,
                source
            };
        });
    });

    React.useEffect(() => {
        setMissingChars(differenceWith(ALPHABET, key.split(''), isEqual));
    }, [key]);

    React.useEffect(() => {
        if (keySource === 'advanced') {
            return;
        }
        const updatedTable: { [k: string]: string } = {};
        ALPHABET.forEach((char, index) => {
            updatedTable[char] = key[index];
        });
        setKeyTable(updatedTable);
    }, [key]);

    React.useEffect(() => {
        if (keySource === 'basic') {
            return;
        }

        const assembledKey = sanitizeKey(Object.values(keyTable).join(''));
        setKey(assembledKey);
    }, [keyTable]);

    React.useEffect(() => {
        if (source !== 'text' || text.length === 0) {
            return;
        }
        if (key.length !== ALPHABET.length) {
            return;
        }
        const cipher = text.split('').map((char) => {
            if (!ALPHABET.includes(char)) {
                return char;
            }
            return key[ALPHABET.indexOf(char)];
        });
        setCipherText(cipher.join(''));
    }, [text, key, missingChars]);

    React.useEffect(() => {
        if (source !== 'cipher' || cipherText.length === 0) {
            return;
        }
        if (key.length !== ALPHABET.length) {
            return;
        }
        const txt = cipherText.split('').map((char) => {
            if (!ALPHABET.includes(char)) {
                return char;
            }
            return ALPHABET[key.split('').indexOf(char)];
        });
        setText(txt.join(''));
    }, [cipherText, key, missingChars]);

    React.useEffect(() => {
        const dups = key.split('');
        uniq(key.split('')).forEach((char) => {
            dups.splice(dups.indexOf(char), 1);
        });
        setDuplicatedChars(uniq(dups));
    }, [missingChars]);

    return (
        <div className={clsx('hero', 'shadow--lw', styles.container)}>
            <div className="container">
                <p className="hero__subtitle">Substitutions-Chiffre</p>
                <h4>Klartext</h4>
                <div className={styles.inputContainer}>
                    <textarea
                        className={clsx(styles.input)}
                        value={text}
                        onChange={(e) => {
                            const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                            setSource('text');
                            setText(sanitizer(e.target.value));
                            setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
                        }}
                        onClick={() => setSource('text')}
                        rows={5}
                        placeholder="Klartext"
                    ></textarea>
                    {source === 'text' && <div className={styles.active}></div>}
                </div>
                <div className={styles.stringInputContainer}>
                    <h4>
                        <label htmlFor="subs-key">Schlüssel</label>
                    </h4>
                    <div className={clsx(styles.iv, 'button-group')}>
                        <input
                            id="subs-key"
                            type="text"
                            placeholder="Ein vollständiges Aplhabet"
                            value={key}
                            autoComplete="off"
                            className={clsx(key.length !== ALPHABET.length && styles.invalid)}
                            onChange={(e) => {
                                const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                                setKeySource('basic');
                                setKey(sanitizeKey(e.target.value));
                                setTimeout(() => {
                                    e.target.setSelectionRange(pos, pos);
                                }, 0);
                            }}
                        />
                        <button
                            className={clsx('button', 'button--primary', 'button--sm')}
                            onClick={() => {
                                setKey(shuffle(ALPHABET).join(''));
                            }}
                        >
                            Zufällig Setzen
                        </button>
                    </div>
                    {missingChars.length > 0 && (
                        <div>
                            <span>Im Schlüssel fehlende Buchstaben:</span>
                            {missingChars.map((char) => {
                                return (
                                    <span className={clsx('badge', 'badge--danger')} key={char}>
                                        {char}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                    {duplicatedChars.length > 0 && (
                        <div>
                            <span>Im Schlüssel doppelt vorhandene Buchstaben:</span>
                            {duplicatedChars.map((char) => {
                                return (
                                    <span className={clsx('badge', 'badge--warning')} key={char}>
                                        {char}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
                <details>
                    <summary>Erweiterte Schlüsseleingabe</summary>
                    <div>
                        <table className={styles.htable}>
                            <tr>
                                <th>Klartext</th>
                                {ALPHABET.map((letter) => (
                                    <td>{letter}</td>
                                ))}
                            </tr>
                            <th>Geheimtext</th>
                            {Object.entries(keyTable).map((entry) => (
                                <td>
                                    <input
                                        className={styles.letterInput}
                                        type="text"
                                        value={entry[1]}
                                        onChange={(e) => {
                                            setKeySource('advanced');
                                            const updatedKeyTable = { ...keyTable };
                                            let newChar = e.target.value.trim();
                                            if (!newChar) {
                                                newChar = ' ';
                                            }
                                            updatedKeyTable[entry[0]] = newChar;
                                            setKeyTable(updatedKeyTable);
                                        }}
                                    />
                                </td>
                            ))}
                        </table>
                    </div>
                </details>
                <h4>Geheimtext</h4>
                <div className={styles.inputContainer}>
                    <textarea
                        className={clsx(styles.input)}
                        value={cipherText}
                        onChange={(e) => {
                            const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                            setSource('cipher');
                            setCipherText(sanitizer(e.target.value));
                            setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
                        }}
                        onClick={() => setSource('cipher')}
                        rows={5}
                        placeholder="Monoalphabetisch verschlüsselter Geheimtext"
                    ></textarea>
                    {source === 'cipher' && <div className={styles.active}></div>}
                </div>
            </div>
        </div>
    );
};

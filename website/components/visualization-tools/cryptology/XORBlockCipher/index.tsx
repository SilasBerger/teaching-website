import clsx from 'clsx';
import { shuffle } from 'lodash';
import * as React from 'react';
import { PENTA_TABLE, sanitizePentaString } from '../../Pentacode';
import styles from '../styles.module.scss';
import { useStore } from '@tdev/hooks/useStore';
import { action } from 'mobx';

const toPentaInt = (text: string): number[] => {
    const t = sanitizePentaString(text);
    return t.split('').map((char) => Number.parseInt(PENTA_TABLE[char], 2));
};

const fromPentaInt = (nums: number[]): string => {
    return nums.map((num) => PENTA_TABLE[num.toString(2).padStart(5, '0')]).join('');
};

const XORBlockCipher = () => {
    const [text, setText] = React.useState('');
    const [cipherText, setCipherText] = React.useState('');
    const [key, setKey] = React.useState('');
    const [mode, setMode] = React.useState<'CBC' | 'ECB'>('ECB');
    const [iv, setIv] = React.useState('');
    const [source, setSource] = React.useState<'text' | 'cipher'>('text');
    const store = useStore('siteStore').toolsStore;

    React.useEffect(() => {
        setText(store.xorBlockCipher?.text || '');
        setCipherText(store.xorBlockCipher?.cipherText || '');
        setKey(store.xorBlockCipher?.key || '');
        setMode(store.xorBlockCipher?.mode || 'ECB');
        setIv(store.xorBlockCipher?.iv || '');
        setSource(store.xorBlockCipher?.source || 'text');
    }, []);

    React.useEffect(() => {
        return action(() => {
            store.xorBlockCipher = {
                text,
                cipherText,
                key,
                mode,
                iv,
                source
            };
        });
    }, [text, cipherText, key, mode, iv, source]);

    React.useEffect(() => {
        const keyLength = key.length;
        if (keyLength === 0 || (mode === 'CBC' && iv.length !== key.length)) {
            return;
        }
        const k = toPentaInt(key);
        // ECB
        if (mode === 'ECB') {
            switch (source) {
                case 'cipher':
                    const cc = toPentaInt(cipherText);
                    let p = fromPentaInt(cc.map((charCode, idx) => charCode ^ k[idx % keyLength]));
                    return setText(p);
                case 'text':
                    const t = toPentaInt(text);
                    const c = fromPentaInt(t.map((charCode, idx) => charCode ^ k[idx % keyLength]));
                    return setCipherText(c);
            }
        }
        // CBC
        const blockCipher = toPentaInt(iv);
        switch (source) {
            case 'cipher':
                const cc = toPentaInt(cipherText);
                const p = fromPentaInt(
                    cc.map((charCode, idx) => {
                        const ind = idx % keyLength;
                        const res = charCode ^ k[ind] ^ blockCipher[ind];
                        blockCipher[ind] = charCode;
                        return res;
                    })
                );
                return setText(p);
            case 'text':
                const t = toPentaInt(text);
                const c = fromPentaInt(
                    t.map((charCode, idx) => {
                        const ind = idx % keyLength;
                        const res = charCode ^ blockCipher[ind] ^ k[ind];
                        blockCipher[ind] = res;
                        return res;
                    })
                );
                return setCipherText(c);
        }
    }, [text, cipherText, key, mode, iv]);

    return (
        <div className={clsx('hero', 'shadow--lw', styles.container)}>
            <div className="container">
                <p className="hero__subtitle">XOR Blockchiffre</p>
                <h4>Modus</h4>
                <div className={clsx('buttongroup', styles.modes)}>
                    <button
                        className={clsx(
                            'button',
                            'button--sm',
                            'button--primary',
                            'button--outline',
                            mode === 'ECB' && 'button--active'
                        )}
                        onClick={() => setMode('ECB')}
                    >
                        ECB
                    </button>
                    <button
                        className={clsx(
                            'button',
                            'button--sm',
                            'button--primary',
                            'button--outline',
                            mode === 'CBC' && 'button--active'
                        )}
                        onClick={() => setMode('CBC')}
                    >
                        CBC
                    </button>
                </div>
                <h4>Klartext</h4>
                <div className={styles.inputContainer}>
                    <textarea
                        className={clsx(styles.input)}
                        value={text}
                        onFocus={() => setSource('text')}
                        onChange={(e) => {
                            setSource('text');
                            const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                            setText(sanitizePentaString(e.target.value));
                            setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
                        }}
                        rows={5}
                        placeholder="Klartext"
                    ></textarea>
                    {source === 'text' && <div className={styles.active}></div>}
                </div>
                <div className={styles.stringInputContainer}>
                    <h4>
                        <label htmlFor="block-chain-key">Schlüssel</label>
                    </h4>
                    <input
                        id="block-chain-key"
                        type="text"
                        placeholder="Schlüssel"
                        value={key}
                        onChange={(e) => {
                            const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                            setKey(sanitizePentaString(e.target.value));
                            setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
                        }}
                    />
                </div>
                {mode === 'CBC' && (
                    <div className={styles.stringInputContainer}>
                        <h4>
                            <label htmlFor="cbc-iv">Initialisierungs Vektor (IV)</label>
                        </h4>
                        <div className={clsx(styles.iv, 'button-group')}>
                            <input
                                id="cbc-iv"
                                type="text"
                                placeholder="Der IV muss die gleiche Länge haben wie der Schlüssel"
                                value={iv}
                                className={clsx(iv.length !== key.length && styles.invalid)}
                                onChange={(e) => {
                                    const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                                    setIv(sanitizePentaString(e.target.value));
                                    setTimeout(() => {
                                        e.target.setSelectionRange(pos, pos);
                                    }, 0);
                                }}
                            />
                            {iv.length !== key.length && (
                                <span
                                    className={clsx('badge', 'badge--danger', styles.errorBadge)}
                                    title="Der IV muss die gleiche Länge haben wie der Schlüssel"
                                >
                                    Länge
                                </span>
                            )}
                            <button
                                className={clsx('button', 'button--primary', 'button--sm')}
                                onClick={() => {
                                    if (key.length === 0) {
                                        return setIv('');
                                    }
                                    const alphabet = Object.keys(PENTA_TABLE).filter(
                                        (char) => char.length === 1
                                    );
                                    const rand = shuffle(
                                        Array(Math.floor(key.length / alphabet.length) + 2)
                                            .fill('')
                                            .reduce((prev, curr) => [...prev, ...alphabet], [])
                                    );
                                    setIv(rand.slice(0, key.length).join(''));
                                }}
                            >
                                Zufällig Setzen
                            </button>
                        </div>
                    </div>
                )}
                <h4>Geheimtext</h4>
                <div className={styles.inputContainer}>
                    <textarea
                        className={clsx(styles.input)}
                        value={cipherText}
                        onFocus={() => setSource('cipher')}
                        onChange={(e) => {
                            setSource('cipher');
                            const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                            setCipherText(sanitizePentaString(e.target.value));
                            setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
                        }}
                        rows={5}
                        placeholder="XOR Verschlüsselter Geheimtext"
                    ></textarea>
                    {source === 'cipher' && <span className={styles.active}></span>}
                </div>
            </div>
        </div>
    );
};

export default XORBlockCipher;

import clsx from 'clsx';
import * as React from 'react';
import styles from './styles.module.scss';
import {useStore} from "@site/src/hooks/useStore";
import {action} from "mobx";
const SANITIZE_REGEX = /[^ABCDEFGHIKLMNOPQRSTUWXYZ\s]/g;
const QUADRAT = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
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
    'W',
    'X',
    'Y',
    'Z',
    ' ',
];

const sanitizer = (text: string) => {
    return text
        .toUpperCase()
        .replace(/\s+/g, ' ')
        .replace(/J/g, 'I')
        .replace(/V/g, 'U')
        .replace(SANITIZE_REGEX, '');
};

export default () => {
    const [text, setText] = React.useState('');
    const [cipherText, setCipherText] = React.useState('');
    const [source, setSource] = React.useState<'text' | 'cipher'>('text');
    const store = useStore('toolsStore');

    React.useEffect(() => {
        setText(store.polybios?.text || '');
        setCipherText(store.polybios?.cipherText || '');
        setSource(store.polybios.source || 'text');
    }, []);

    React.useEffect(() => {
        return action(() => {
            store.polybios = {
                text,
                cipherText,
                source,
            }
        })
    }, [text, cipherText, source]);

    React.useEffect(() => {
        if (source !== 'text' || text.length === 0) {
            return;
        }
        const cipher = text.split('').map((char) => {
            const idx = QUADRAT.indexOf(char);
            const col = idx % 5;
            const row = Math.floor(idx / 5);
            return `${row + 1}${col + 1}`;
        });
        setCipherText(cipher.join(' '));
    }, [text]);

    React.useEffect(() => {
        if (source !== 'cipher' || cipherText.length === 0) {
            return;
        }
        const cLines = cipherText.split(' ');
        const txt = cLines.map((tuple) => {
            const [row, col] = tuple.split('').map((c) => Number.parseInt(c, 10) - 1);
            return QUADRAT[row * 5 + col];
        });
        setText(txt.join(''));
    }, [cipherText]);

    return (
        <div className={clsx('hero', 'shadow--lw', styles.container)}>
            <div className="container">
                <p className="hero__subtitle">Polybios-Chiffre</p>
                <h4>Klartext</h4>
                <textarea
                    className={clsx(styles.input)}
                    value={text}
                    onChange={(e) => {
                        const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                        setSource('text');
                        setText(sanitizer(e.target.value));
                        setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
                    }}
                    rows={5}
                    placeholder="Klartext"
                ></textarea>
                <h4>Geheimtext</h4>
                <textarea
                    className={clsx(styles.input)}
                    value={cipherText}
                    onChange={(e) => {
                        const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                        setSource('cipher');
                        setCipherText(e.target.value.replace(/\s+/g, ' ').replace(/[^0-9\s]/g, ''));
                        setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
                    }}
                    rows={5}
                    placeholder="Polybios Verschlüsselter Geheimtext"
                ></textarea>
            </div>
        </div>
    );
};

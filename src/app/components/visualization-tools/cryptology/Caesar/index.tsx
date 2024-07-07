import clsx from 'clsx';
import * as React from 'react';
import styles from './styles.module.scss';
import {useStore} from "@site/src/app/hooks/useStore";
import {action} from "mobx";
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const sanitizer = (text: string) => {
  return text.toUpperCase().replace(/\s+/g, ' ');
};

export default () => {
  const [text, setText] = React.useState('');
  const [key, setKey] = React.useState('D');
  const [cipherText, setCipherText] = React.useState('');
  const [source, setSource] = React.useState<'text' | 'cipher'>('text');
  const toolStore = useStore('toolStore');

  React.useEffect(() => {
    setText(toolStore.caesar?.text || '');
    setCipherText(toolStore.caesar?.cipher || '');
    setKey(toolStore.caesar?.key || 'D');
    setSource(toolStore.caesar?.source || 'text');
  }, []);

  React.useEffect(() => {
    return action(() => {
      toolStore.caesar = {
        text: text,
        cipher: cipherText,
        key: key,
        source: source
      }
    })
  }, [key, text, cipherText, source]);

  React.useEffect(() => {
    if (source !== 'text' || text.length === 0) {
      return;
    }
    const shift = ALPHABET.indexOf(key);
    const cipher = text.split('').map((char) => {
      if (!ALPHABET.includes(char)) {
        return char;
      }
      return ALPHABET[(ALPHABET.indexOf(char) + shift) % ALPHABET.length];
    });
    return setCipherText(cipher.join(''));
  }, [text, key]);

  React.useEffect(() => {
    const shift = ALPHABET.indexOf(key);
    if (source !== 'cipher' || cipherText.length === 0) {
      return;
    }
    const txt = cipherText.split('').map((char) => {
      if (!ALPHABET.includes(char)) {
        return char;
      }
      return ALPHABET[(ALPHABET.length + ALPHABET.indexOf(char) - shift) % ALPHABET.length];
    });
    return setText(txt.join(''));
  }, [cipherText, key]);

  return (
    <div className={clsx('hero', 'shadow--lw', styles.container)}>
      <div className="container">
        <p className="hero__subtitle">Caesar-Chiffre</p>
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
        <h4>
          Schlüssel: <span className="badge badge--primary">{key}</span>
        </h4>
        <div className={styles.caesarKey}>
          <ul className={clsx('pills', styles.pills)}>
            {ALPHABET.map((char, idx) => {
              return (
                <li
                  className={clsx('pills__item', key === char && 'pills__item--active')}
                  onClick={() => setKey(char)}
                  key={char}
                >
                  {char}
                </li>
              );
            })}
          </ul>
        </div>
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
                      placeholder="Caesar Verschlüsselter Geheimtext"
                    ></textarea>
          {source === 'cipher' && <div className={styles.active}></div>}
        </div>
      </div>
    </div>
  );
};

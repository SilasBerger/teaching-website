import clsx from 'clsx';
import * as React from 'react';
import styles from './styles.module.scss';

export default () => {
    const [text, setText] = React.useState('');
    const [cipherText, setCipherText] = React.useState('');
    const [key, setKey] = React.useState(2);
    const [source, setSource] = React.useState<'text' | 'cipher'>('text');
    const [cursorPos, setCursorPos] = React.useState(0);

    React.useEffect(() => {
        if (!key || source !== 'text') {
            return;
        }
        const lines = Array(key).fill('');
        text.split('').forEach((char, idx) => {
            lines[idx % key] += char;
        });
        setCipherText(lines.join('\n').trim());
    }, [text, key]);

    React.useEffect(() => {
        if (!key || source !== 'cipher') {
            return;
        }
        if (cipherText.length === 0) {
            if (text !== '') { setText(''); }
            return;
        }
        let cLines = cipherText.split('\n');
        cLines = cLines.map((l) => l.padEnd(Math.max(...(cLines.map(c => c.length))), ' '));
        let cipher = cLines.join('').replace(/\t+/g, ' ');
        const cols = Math.ceil(cipher.length / key);

        cipher = cipher.padEnd(cols * key, ' ')
        let decrypt = '';
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < key; j++) {
                decrypt += cipher.charAt(i + j * cols);
            }
        }
        setText(decrypt);
    }, [cipherText, key]);

    return (
      <div className={clsx('hero', 'shadow--lw', styles.container)}>
          <div className="container">
              <p className="hero__subtitle">Skytale</p>
              <h4>Klartext</h4>
              <textarea
                className={clsx(styles.input)}
                value={text}
                onChange={(e) => {
                    setSource('text');
                    const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                    setText(e.target.value.replace(/\n/g, ' '));
                    setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
                }}
                rows={5}
                placeholder="Klartext"
              ></textarea>
              <div className={styles.stringInputContainer}>
                  <h4>
                      <label htmlFor="skytale-key">Schlüssel</label>
                  </h4>
                  <input
                    id="skytale-key"
                    type="number"
                    min={1}
                    max={26}
                    placeholder="Schlüssel"
                    value={key || ''}
                    onChange={(e) => {
                        setKey(Number.parseInt(e.target.value, 10));
                    }}
                  />
              </div>
              <h4>Geheimtext</h4>
              <textarea
                className={clsx(styles.input)}
                value={cipherText}
                onChange={(e) => {
                    setSource('cipher');
                    setCipherText(e.target.value);
                }}
                rows={5}
                placeholder="Skytale Verschlüsselter Geheimtext"
              ></textarea>
          </div>
      </div>
    );
};

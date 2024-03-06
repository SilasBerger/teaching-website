import clsx from 'clsx';
import * as React from 'react';
import styles from './styles.module.scss';
import { sha256 } from 'js-sha256';

const HashSHA2 = () => {
  const [text, setText] = React.useState('');
  const [sha2Text, setSHA2Text] = React.useState('');

  React.useEffect(() => {
    setSHA2Text(sha256(text));
  }, [text]);

  return (
    <div className={clsx('hero', 'shadow--lw', styles.container)}>
      <div className="container">
        <p className="hero__subtitle">SHA-2 Hash</p>
        <h4>Input</h4>
        <textarea
          className={clsx(styles.input)}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          rows={5}
          placeholder="Text"
        ></textarea>
        <h4>SHA-2 Hash</h4>
        <textarea
          className={clsx(styles.input)}
          value={sha2Text}
          readOnly
          placeholder="SHA2-Hash"
        ></textarea>
      </div>
    </div>
  );
};

export default HashSHA2;

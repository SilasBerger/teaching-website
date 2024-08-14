import styles from './styles.module.scss';
import {useState} from "react";

interface Props {
  value?: string;
  height?: string;
}

const TextBoxPlayground = ({value, height}: Props) => {

  const [text, setText] = useState<string>(value ?? '');

  return (
    <textarea
      className={styles.textarea} style={{height: height ?? '10rem'}}
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};

export default TextBoxPlayground;
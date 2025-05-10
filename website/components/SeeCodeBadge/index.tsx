import styles from "./styles.module.scss";
import clsx from "clsx";

export interface Props {
  url: string;
}

export default ({url}: Props) => {
  return (
    <div className={styles.badge}>
      <a href={url} target='_blank'>
        <span className={clsx('mdi', 'mdi-code-block-braces')}> Code</span>
      </a>
    </div>
  );
};

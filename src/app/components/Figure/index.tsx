import styles from "./styles.module.scss";
import clsx from "clsx";

export interface Props {
  src: any;
  alt?: string;
  width?: string;
  align?: string;
}

const Figure = ({src, alt, width, align}: Props) => {
  return (
    <div className={clsx(styles.container, {
      [styles.alignCenter]: align === 'center',
      [styles.alignRight]: align === 'right',
    })}>
      <img src={src} alt={alt ?? ''} width={width ?? '100%'}/>
    </div>
  );
};

export default Figure;

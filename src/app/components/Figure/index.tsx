import styles from "./styles.module.scss";
import clsx from "clsx";

export interface Props {
  src: any;
  alt?: string;
  width?: string;
  align?: string;
  caption?: string;
  alignCaption?: string;
}

const Figure = ({src, alt, width, align, caption, alignCaption}: Props) => {
  return (
    <div className={clsx(styles.layoutContainer, {
      [styles.alignCenter]: align === 'center',
      [styles.alignRight]: align === 'right',
    })}>
      <div className={styles.contentContainer} style={{width: width ?? '100%'}}>
        <img src={src} alt={alt ?? ''}/>
        {!!caption && <div className={clsx(styles.caption, {
          [styles.alignLeft]: alignCaption === 'left',
          [styles.alignCenter]: alignCaption === 'center',
        })}>{ caption }</div>}
      </div>
    </div>
  );
};

export default Figure;

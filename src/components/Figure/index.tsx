import styles from "./styles.module.scss";
import clsx from "clsx";

export interface Props {
  src: any;
  alt?: string;
  width?: string;
  maxWidth?: string;
  align?: string;
  caption?: string;
  alignCaption?: string;
}

const Figure = ({src, alt, width, maxWidth, align, caption, alignCaption}: Props) => {

  const widthValue = !width && !maxWidth ? '100%' : width;

  return (
    <div className={clsx(styles.layoutContainer, {
      [styles.alignCenter]: align === 'center',
      [styles.alignRight]: align === 'right',
    })}>
      <div className={styles.contentContainer} style={{width: widthValue, maxWidth: maxWidth}}>
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

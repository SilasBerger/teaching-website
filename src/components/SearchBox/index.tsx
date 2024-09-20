import React from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

interface Props {
  children?: React.ReactNode;
  caption?: string;
  href?: string;
}

const SearchBox = ({children, caption, href}: Props) => {
  return (
    <figure className={styles.searchFigure}>
      <div className={styles.searchContainer}>
        <p style={{margin: 0}}>
          <slot>{children}</slot>
        </p>
        <a href={href} target="_blank" className={clsx({'active': !!href})}>
          <i className={clsx(styles.searchIcon, 'mdi', 'mdi-magnify')}></i>
        </a>
      </div>
      {caption && (
        <figcaption>{caption}</figcaption>
      )}
    </figure>
  );
};

export default SearchBox;

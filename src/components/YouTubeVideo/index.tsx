import styles from "./styles.module.scss";

export interface Props {
  videoUrl: string,
  title?: string,
  width?: string
}

function rewriteUrlToNoCookie(videoUrl: string) {
  const url = new URL(videoUrl);
  return `https://www.youtube-nocookie.com/embed/${url.pathname}`;
}

export default ({videoUrl, title, width}: Props) => {
  return (
    <div className={styles.videoContainer} style={{width: width ?? "100%"}}>
      <iframe
        src={rewriteUrlToNoCookie(videoUrl)}
        title={title ?? 'YouTube video player'}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen>
      </iframe>
    </div>
  );
}

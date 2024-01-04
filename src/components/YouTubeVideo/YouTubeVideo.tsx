import styles from "./YouTubeVideo.module.css";

export interface YouTubeVideoProps {
  videoId: string,
  title?: string,
  width?: string
}

export const YouTubeVideo = ({videoId, title, width}: YouTubeVideoProps) => {
  return (
    <div className={styles.videoContainer} style={{width: width ?? "100%"}}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
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

import styles from "./YouTubeVideo.module.css";

export interface YouTubeVideoProps {
  videoId: string,
  title?: string,
  width?: string
  height?: string,
}

export const YouTubeVideo = ({videoId, title, width, height}: YouTubeVideoProps) => {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title={title ?? 'YouTube video player'}
      width={ width ?? "560" }
      height={ height ?? "315" }
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen>
    </iframe>
  );
}

export interface Props {
  src: any;
  alt?: string;
  width?: string;
}

const Figure = ({src, alt, width}: Props) => {
  return (
    <img src={src} alt={alt ?? ''} width={width ?? '100%'}/>
  );
};

export default Figure;

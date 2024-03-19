import {useState} from "react";
import styles from "./styles.module.scss";

const ImageEncryption = () => {

  const SOURCE_IMAGE_ID = 'source-image';
  const SOURCE_CANVAS_ID = 'source-canvas';
  const DEST_CANVAS_ID = 'dest-canvas';

  const [imageDataUrl, setImageDataUrl] = useState<string | null>();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageDataUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function encrypt() {
    const sourceImage = document.getElementById(SOURCE_IMAGE_ID) as HTMLImageElement;
    const sourceCanvas = document.getElementById(SOURCE_CANVAS_ID) as HTMLCanvasElement;
    const destCanvas = document.getElementById(DEST_CANVAS_ID) as HTMLCanvasElement;

    const width = sourceImage.width;
    const height = sourceImage.height;

    sourceCanvas.width = width;
    sourceCanvas.height = height;
    destCanvas.width = width;
    destCanvas.height = height;
    const ctx = sourceCanvas.getContext('2d');

    ctx.drawImage(sourceImage, 0, 0);

    const sourceImageData = ctx.getImageData(0, 0, width, height);

    const destImageBytes = sourceImageData.data.map((value, idx) => {
      return idx % 3 === 0 ? value : (value * 2) % 255;
    });
    const destImageData = ctx.createImageData(sourceImageData);
    destImageData.data.set(destImageBytes);

    console.log(sourceImageData, destImageData);

    destCanvas.getContext('2d').putImageData(destImageData, 0, 0);
  }

  return (
    <div>
      <input
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={handleImageChange}
      />

      <img id={SOURCE_IMAGE_ID} src={imageDataUrl} className={styles.hidden} />

      <canvas id={SOURCE_CANVAS_ID} />
      <canvas id={DEST_CANVAS_ID} />

      <button onClick={encrypt}>Encrypt</button>
    </div>
  );
}

export default ImageEncryption;

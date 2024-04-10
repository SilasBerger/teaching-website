import * as React from "react";
import {useState} from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import {shuffle} from "lodash";
import {PENTA_TABLE} from "@site/src/app/components/visualization-tools/Pentacode";

const ImageEncryption = () => {

  const SRC_IMAGE_ID = 'source-image';
  const SRC_CANVAS_ID = 'source-canvas';
  const DEST_CANVAS_ID = 'dest-canvas';

  const [imageDataUrl, setImageDataUrl] = useState<string | null>();
  const [srcImageLoaded, setSrcImageLoaded] = useState<boolean>(false);
  const [resultReady, setResultReady] = useState<boolean>(false);
  const [mode, setMode] = React.useState<'CBC' | 'ECB'>('ECB');
  const [key, setKey] = React.useState('');
  const [iv, setIv] = React.useState('');

  function asCharCodes(value: string) {
    return value.split('').map(c => c.charCodeAt(0) % 256);
  }

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  function onImageLoaded() {
    setResultReady(false);
    resizeCanvasToSrcImage(SRC_CANVAS_ID);
    drawSrcImage();
    setSrcImageLoaded(true);
  }

  function getSrcImage(): HTMLImageElement {
    return document.getElementById(SRC_IMAGE_ID) as HTMLImageElement;
  }

  function resizeCanvasToSrcImage(canvasId: string) {
    if (!imageDataUrl) {
      return;
    }

    const srcImage = getSrcImage();
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    canvas.width = srcImage.width;
    canvas.height = srcImage.height;
  }

  function drawSrcImage() {
    if (!imageDataUrl) {
      return;
    }

    const srcCanvas = document.getElementById(SRC_CANVAS_ID) as HTMLCanvasElement;
    const srcCtxt = srcCanvas.getContext('2d');
    srcCtxt.drawImage(getSrcImage(), 0, 0);
  }

  async function encrypt() {
    resizeCanvasToSrcImage(DEST_CANVAS_ID);

    const srcCanvas = document.getElementById(SRC_CANVAS_ID) as HTMLCanvasElement;
    const destCanvas = document.getElementById(DEST_CANVAS_ID) as HTMLCanvasElement;

    const srcImage = getSrcImage();
    const srcCtxt = srcCanvas.getContext('2d');
    const srcImageData = srcCtxt.getImageData(0, 0, srcImage.width, srcImage.height);
    const destImageData = srcCtxt.createImageData(srcImageData);

    const srcRgbBytes = extractRgbBytes(srcImageData);
    const destRgbBytes = (mode === 'ECB') ? encryptEcb(srcRgbBytes) : encryptCbc(srcRgbBytes);

    destImageData.data.set(inflateToRgbaBytes(destRgbBytes, 255));
    destCanvas.getContext('2d').putImageData(destImageData, 0, 0);

    setResultReady(true);
  }

  function extractRgbBytes(imageData: ImageData): Uint8ClampedArray {
    return imageData.data.filter((value, idx) => (idx + 1) % 4 != 0);
  }

  function inflateToRgbaBytes(rgbBytes: Uint8ClampedArray, aValue: number): Uint8ClampedArray {
    const mapped: number[] = Array.from(rgbBytes)
      .flatMap((val, idx) => (idx % 3) === 2 ? [val, aValue] : [val]);
    return Uint8ClampedArray.from(mapped);
  }

  function encryptEcb(plaintextBytes: Uint8ClampedArray): Uint8ClampedArray {
    const keyBytes = asCharCodes(key);
    return plaintextBytes
      .map((plaintextByte, keyByteIdx) => plaintextByte ^ keyBytes[keyByteIdx % key.length]);
  }

  function encryptCbc(plaintextBytes: Uint8ClampedArray): Uint8ClampedArray {
    const chainedBlock = asCharCodes(iv);
    const keyBytes = asCharCodes(key);
    return plaintextBytes.map((plaintextByte, plaintextByteIdx) => {
      const keyByteIndex = plaintextByteIdx % key.length;
      const ciphertextByte = plaintextByte ^ chainedBlock[keyByteIndex] ^ keyBytes[keyByteIndex];
      chainedBlock[keyByteIndex] = ciphertextByte;

      return ciphertextByte;
    });
  }

  return (
    <div className={clsx('hero', 'shadow--lw', styles.container)}>
      <div className="container">
        <p className="hero__subtitle">Bildverschlüsselung</p>
        <h4>Modus</h4>
        <div className={clsx('buttongroup', styles.modes)}>
          <button
            className={clsx(
              'button',
              'button--sm',
              'button--primary',
              'button--outline',
              mode === 'ECB' && 'button--active'
            )}
            onClick={() => setMode('ECB')}
          >
            ECB
          </button>
          <button
            className={clsx(
              'button',
              'button--sm',
              'button--primary',
              'button--outline',
              mode === 'CBC' && 'button--active'
            )}
            onClick={() => setMode('CBC')}
          >
            CBC
          </button>
        </div>
        <div className={styles.stringInputContainer}>
          <h4>
            <label htmlFor="block-chain-key">Schlüssel</label>
          </h4>
          <input
            id="block-chain-key"
            type="text"
            placeholder="Schlüssel"
            value={key}
            onChange={(e) => {
              const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
              setKey(e.target.value);
              setTimeout(() => e.target.setSelectionRange(pos, pos), 0);
            }}
          />
        </div>
        {mode === 'CBC' && (
          <div className={styles.stringInputContainer}>
            <h4>
              <label htmlFor="cbc-iv">Initialisierungs Vektor (IV)</label>
            </h4>
            <div className={clsx(styles.iv, 'button-group')}>
              <input
                id="cbc-iv"
                type="text"
                placeholder="Der IV muss die gleiche Länge haben wie der Schlüssel"
                value={iv}
                className={clsx(iv.length !== key.length && styles.invalid)}
                onChange={(e) => {
                  const pos = Math.max(e.target.selectionStart, e.target.selectionEnd);
                  setIv(e.target.value);
                  setTimeout(() => {
                    e.target.setSelectionRange(pos, pos);
                  }, 0);
                }}
              />
              {iv.length !== key.length && (
                <span
                  className={clsx('badge', 'badge--danger', styles.errorBadge)}
                  title="Der IV muss die gleiche Länge haben wie der Schlüssel"
                >
                                    Länge
                                </span>
              )}
              <button
                className={clsx('button', 'button--primary', 'button--sm')}
                onClick={() => {
                  if (key.length === 0) {
                    return setIv('');
                  }
                  const alphabet = Object.keys(PENTA_TABLE).filter(
                    (char) => char.length === 1
                  );
                  const rand = shuffle(
                    Array(Math.floor(key.length / alphabet.length) + 2)
                      .fill('')
                      .reduce((prev, curr) => [...prev, ...alphabet], [])
                  );
                  setIv(rand.slice(0, key.length).join(''));
                }}
              >
                Zufällig Setzen
              </button>
            </div>
          </div>
        )}

        <h4>Bild auswählen</h4>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={uploadImage}
        />

        <img id={SRC_IMAGE_ID} src={imageDataUrl} className={styles.hidden} onLoad={onImageLoaded} />

        <div className={styles.canvasesContainer}>
          <div className={clsx({[styles.hidden]: !imageDataUrl})}>
            <h4>Unverschlüsseltes Bild</h4>
            <canvas id={SRC_CANVAS_ID}/>
          </div>

          <div className={clsx({[styles.hidden]: !resultReady})}>
            <h4>Verschlüsseltes Bild</h4>
            <canvas id={DEST_CANVAS_ID}/>
          </div>
        </div>

        <button className={clsx(
          'button',
          'button--primary'
        )} onClick={encrypt}
        disabled={!(srcImageLoaded && key && (mode === 'ECB' || iv))}>🔑 Verschlüsseln
        </button>
      </div>
    </div>
  );
}

export default ImageEncryption;

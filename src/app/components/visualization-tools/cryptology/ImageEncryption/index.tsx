import {useState} from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import * as React from "react";
import {PENTA_TABLE, sanitizePentaString} from "@site/src/app/components/visualization-tools/Pentacode";
import {shuffle} from "lodash";

const ImageEncryption = () => {

  const SRC_IMAGE_ID = 'source-image';
  const SRC_CANVAS_ID = 'source-canvas';
  const DEST_CANVAS_ID = 'dest-canvas';

  const [imageDataUrl, setImageDataUrl] = useState<string | null>();
  const [mode, setMode] = React.useState<'CBC' | 'ECB'>('ECB');
  const [key, setKey] = React.useState('');
  const [iv, setIv] = React.useState('');

  const toPentaInt = (text: string): number[] => {
    console.log({toPentaInt: text});
    const t = sanitizePentaString(text);
    return t.split('').map((char) => Number.parseInt(PENTA_TABLE[char], 2));
  };

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

  async function encrypt() {
    const srcImage = document.getElementById(SRC_IMAGE_ID) as HTMLImageElement;
    const srcCanvas = document.getElementById(SRC_CANVAS_ID) as HTMLCanvasElement;
    const destCanvas = document.getElementById(DEST_CANVAS_ID) as HTMLCanvasElement;
    const ctx = srcCanvas.getContext('2d');

    const width = srcImage.width;
    const height = srcImage.height;

    srcCanvas.width = width;
    srcCanvas.height = height;
    destCanvas.width = width;
    destCanvas.height = height;

    ctx.drawImage(srcImage, 0, 0);

    const srcImageData = ctx.getImageData(0, 0, width, height);
    const destImageData = ctx.createImageData(srcImageData);
    const srcRgbBytes = extractRgbBytes(srcImageData);

    const destRgbBytes = (mode === 'ECB') ? ciphertextBytesEcb(srcRgbBytes) : ciphertextBytesCbc(srcRgbBytes);

    console.log({srcRgbBytes, destRgbBytes});

    destImageData.data.set(inflateToRgbaBytes(destRgbBytes, 255));
    destCanvas.getContext('2d').putImageData(destImageData, 0, 0);
  }

  function extractRgbBytes(imageData: ImageData): Uint8ClampedArray {
    return imageData.data.filter((value, idx) => (idx + 1) % 4 != 0);
  }

  function inflateToRgbaBytes(rgbBytes: Uint8ClampedArray, aValue: number): Uint8ClampedArray {
    const mapped: number[] = Array.from(rgbBytes)
      .flatMap((val, idx) => (idx % 3) === 2 ? [val, aValue] : [val]);
    return Uint8ClampedArray.from(mapped);
  }

  function transformKeyByte(keyByte: number): number {
    return (keyByte * 4) % 255;
  }

  function ciphertextBytesEcb(plaintextBytes: Uint8ClampedArray): Uint8ClampedArray {
    const keyBytes = toPentaInt(key);
    return plaintextBytes
      .map((plaintextByte, keyByteIdx) => plaintextByte ^ transformKeyByte(keyBytes[keyByteIdx % key.length]));
  }

  function ciphertextBytesCbc(plaintextBytes: Uint8ClampedArray): Uint8ClampedArray {
    const chainedBlock = toPentaInt(iv);
    const keyBytes = toPentaInt(key);
    return plaintextBytes.map((plaintextByte, plaintextByteIdx) => {
      const keyByteIndex = plaintextByteIdx % key.length;
      const ciphertextByte = plaintextByte ^ chainedBlock[keyByteIndex] ^ transformKeyByte(keyBytes[keyByteIndex]);
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
              setKey(sanitizePentaString(e.target.value));
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
                  setIv(sanitizePentaString(e.target.value));
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


        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={uploadImage}
        />

        <img id={SRC_IMAGE_ID} src={imageDataUrl} className={styles.hidden}/>

        <canvas id={SRC_CANVAS_ID}/>
        <canvas id={DEST_CANVAS_ID}/>

        <button onClick={encrypt}>Encrypt</button>
      </div>
    </div>
  );
}

export default ImageEncryption;

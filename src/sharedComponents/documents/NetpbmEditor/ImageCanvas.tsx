import React, { useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';

interface Props {
    pixels?: Uint8ClampedArray;
    width: number;
    height: number;
}

const ImageCanvas = ({ width, height, pixels }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const scale = 10;
    const offsetX = 0;
    const offsetY = 0;

    const hidden = () => {
        return !pixels || pixels.length === 0 || width === 0 || height === 0;
    };

    useEffect(() => {
        if (hidden()) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return;
        }

        // Set canvas size to be larger than the image
        canvas.width = width * scale;
        canvas.height = height * scale;

        // Create a temporary canvas to hold the original image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        if (!tempCtx) {
            return;
        }

        // Put the image data on the temporary canvas
        const imageData = new ImageData(pixels!, width, height);
        tempCtx.putImageData(imageData, 0, 0);

        // Clear the main canvas and draw the scaled image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, offsetX, offsetY, width * scale, height * scale);
    }, [pixels, width, height, scale, offsetX, offsetY]);

    return <canvas className={clsx(styles.canvas, { [styles.hidden]: hidden() })} ref={canvasRef} />;
};

export default ImageCanvas;

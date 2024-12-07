import React from 'react';
import type { default as ExcalidrawLib } from '@excalidraw/excalidraw';

export const useExcalidraw = (): typeof ExcalidrawLib | null => {
    const [Excalidraw, setExcalidraw] = React.useState<typeof ExcalidrawLib | null>(null);
    React.useEffect(() => {
        import('@excalidraw/excalidraw').then((excalidraw) => {
            setExcalidraw(excalidraw);
        });
    }, []);
    return Excalidraw;
};

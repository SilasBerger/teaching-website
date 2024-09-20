import type Quill from 'quill';
import type { Op } from 'quill/core';

export const deleteSelectedImage = (quill: Quill, imgSrc: string) => {
    const delta = quill.editor.getDelta();
    const toDeleteIdx = delta.ops.findIndex((op: Op) => {
        if (op.insert && op.attributes?.['data-selected']) {
            const isSameSource = (op.insert as { image?: string }).image === imgSrc;
            return isSameSource;
        }
    });
    if (toDeleteIdx >= 0) {
        delta.ops.splice(toDeleteIdx, 1);
        quill.setContents(delta, 'user');
        quill.focus();
    }
};

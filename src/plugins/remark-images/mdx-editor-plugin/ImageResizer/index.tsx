/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * By Mdx Editor, @url https://github.com/mdx-editor/editor/tree/main/src/plugins/image
 */

import type { LexicalEditor } from 'lexical';

import * as React from 'react';
import { useRef } from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

const Direction = {
    east: 1 << 0,
    north: 1 << 3,
    south: 1 << 1,
    west: 1 << 2
};

export default function ImageResizer({
    onResizeStart,
    onResizeEnd,
    imageRef,
    maxWidth,
    editor
}: {
    editor: LexicalEditor;
    imageRef: { current: null | HTMLElement };
    maxWidth?: number;
    onResizeEnd: (width: number, height: number) => void;
    onResizeStart: () => void;
}): React.ReactNode {
    const controlWrapperRef = useRef<HTMLDivElement>(null);
    const userSelect = useRef({
        priority: '',
        value: 'default'
    });
    const positioningRef = useRef<{
        currentHeight: number;
        currentWidth: number;
        direction: number;
        isResizing: boolean;
        ratio: number;
        startHeight: number;
        startWidth: number;
        startX: number;
        startY: number;
    }>({
        currentHeight: 0,
        currentWidth: 0,
        direction: 0,
        isResizing: false,
        ratio: 0,
        startHeight: 0,
        startWidth: 0,
        startX: 0,
        startY: 0
    });
    const editorRootElement = editor.getRootElement();
    // Find max width, accounting for editor padding.
    const maxWidthContainer = maxWidth
        ? maxWidth
        : editorRootElement !== null
          ? editorRootElement.getBoundingClientRect().width - 20
          : 100;
    const maxHeightContainer =
        editorRootElement !== null ? editorRootElement.getBoundingClientRect().height - 20 : 100;

    const minWidth = 100;
    const minHeight = 100;

    const setStartCursor = (direction: number) => {
        const ew = direction === Direction.east || direction === Direction.west;
        const ns = direction === Direction.north || direction === Direction.south;
        const nwse =
            (direction & Direction.north && direction & Direction.west) ||
            (direction & Direction.south && direction & Direction.east);

        const cursorDir = ew ? 'ew' : ns ? 'ns' : nwse ? 'nwse' : 'nesw';

        if (editorRootElement !== null) {
            editorRootElement.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (document.body !== null) {
            document.body.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
            userSelect.current.value = document.body.style.getPropertyValue('-webkit-user-select');
            userSelect.current.priority = document.body.style.getPropertyPriority('-webkit-user-select');
            document.body.style.setProperty('-webkit-user-select', `none`, 'important');
        }
    };

    const setEndCursor = () => {
        if (editorRootElement !== null) {
            editorRootElement.style.setProperty('cursor', 'text');
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (document.body !== null) {
            document.body.style.setProperty('cursor', 'default');
            document.body.style.setProperty(
                '-webkit-user-select',
                userSelect.current.value,
                userSelect.current.priority
            );
        }
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, direction: number) => {
        if (!editor.isEditable()) {
            return;
        }

        const image = imageRef.current;
        const controlWrapper = controlWrapperRef.current;

        if (image !== null && controlWrapper !== null) {
            event.preventDefault();
            const { width, height } = image.getBoundingClientRect();
            const positioning = positioningRef.current;
            positioning.startWidth = width;
            positioning.startHeight = height;
            positioning.ratio = width / height;
            positioning.currentWidth = width;
            positioning.currentHeight = height;
            positioning.startX = event.clientX;
            positioning.startY = event.clientY;
            positioning.isResizing = true;
            positioning.direction = direction;

            setStartCursor(direction);
            onResizeStart();

            controlWrapper.classList.add(styles.imageControlWrapperResizing);
            image.style.height = `${height}px`;
            image.style.width = `${width}px`;

            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);
        }
    };
    const handlePointerMove = (event: PointerEvent) => {
        const image = imageRef.current;
        const positioning = positioningRef.current;

        const isHorizontal = positioning.direction & (Direction.east | Direction.west);

        if (image !== null && positioning.isResizing) {
            let height: number;
            let width: number;
            if (isHorizontal) {
                const flip = positioning.direction & Direction.west ? 1 : -1;
                const diff = Math.floor(positioning.startX - event.clientX) * flip;
                width = clamp(positioning.startWidth + diff, minWidth, maxWidthContainer);
                height = width / positioning.ratio;
            } else {
                const flip = positioning.direction & Direction.north ? 1 : -1;
                const diff = Math.floor(positioning.startY - event.clientY) * flip;
                height = clamp(positioning.startHeight + diff, minHeight, maxHeightContainer);
                width = height * positioning.ratio;
            }
            image.style.width = `${width}px`;
            image.style.height = `${height}px`;
            positioning.currentHeight = height;
            positioning.currentWidth = width;
        }
    };
    const handlePointerUp = () => {
        const image = imageRef.current;
        const positioning = positioningRef.current;
        const controlWrapper = controlWrapperRef.current;
        if (image !== null && controlWrapper !== null && positioning.isResizing) {
            const width = Math.round(positioning.currentWidth);
            const height = Math.round(positioning.currentHeight);
            positioning.startWidth = 0;
            positioning.startHeight = 0;
            positioning.ratio = 0;
            positioning.startX = 0;
            positioning.startY = 0;
            positioning.currentWidth = 0;
            positioning.currentHeight = 0;
            positioning.isResizing = false;

            controlWrapper.classList.remove(styles.imageControlWrapperResizing);

            setEndCursor();
            onResizeEnd(width, height);

            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        }
    };
    return (
        <div ref={controlWrapperRef}>
            <div
                className={clsx(styles.imageResizer, styles.imageResizerN)}
                onPointerDown={(event) => {
                    handlePointerDown(event, Direction.north);
                }}
            />
            <div
                className={clsx(styles.imageResizer, styles.imageResizerNe)}
                onPointerDown={(event) => {
                    handlePointerDown(event, Direction.north | Direction.east);
                }}
            />
            <div
                className={clsx(styles.imageResizer, styles.imageResizerE)}
                onPointerDown={(event) => {
                    handlePointerDown(event, Direction.east);
                }}
            />
            <div
                className={clsx(styles.imageResizer, styles.imageResizerSe)}
                onPointerDown={(event) => {
                    handlePointerDown(event, Direction.south | Direction.east);
                }}
            />
            <div
                className={clsx(styles.imageResizer, styles.imageResizerS)}
                onPointerDown={(event) => {
                    handlePointerDown(event, Direction.south);
                }}
            />
            <div
                className={clsx(styles.imageResizer, styles.imageResizerSw)}
                onPointerDown={(event) => {
                    handlePointerDown(event, Direction.south | Direction.west);
                }}
            />
            <div
                className={clsx(styles.imageResizer, styles.imageResizerW)}
                onPointerDown={(event) => {
                    handlePointerDown(event, Direction.west);
                }}
            />
            <div
                className={clsx(styles.imageResizer, styles.imageResizerNw)}
                onPointerDown={(event) => {
                    handlePointerDown(event, Direction.north | Direction.west);
                }}
            />
        </div>
    );
}

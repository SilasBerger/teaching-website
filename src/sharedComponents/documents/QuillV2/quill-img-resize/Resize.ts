import { BaseModule } from './BaseModule';
export default class Resize extends BaseModule {
    boxes: HTMLDivElement[] = [];
    dragBox?: HTMLElement;
    dragStartX: number = 0;
    preDragWidth: number = 0;
    onCreate = () => {
        // track resize handles
        this.boxes = [];

        // add 4 resize handles
        this.addBox('nwse-resize'); // top left
        this.addBox('nesw-resize'); // top right
        this.addBox('nwse-resize'); // bottom right
        this.addBox('nesw-resize'); // bottom left

        this.positionBoxes();
    };

    onDestroy = () => {
        // reset drag handle cursors
        this.setCursor('');
    };

    positionBoxes = () => {
        const handleXOffset = `${-parseFloat(this.options.handleStyles.width) / 2}px`;
        const handleYOffset = `${-parseFloat(this.options.handleStyles.height) / 2}px`;

        // set the top and left for each drag handle
        [
            { left: handleXOffset, top: handleYOffset }, // top left
            { right: handleXOffset, top: handleYOffset }, // top right
            { right: handleXOffset, bottom: handleYOffset }, // bottom right
            { left: handleXOffset, bottom: handleYOffset } // bottom left
        ].forEach((pos, idx) => {
            Object.assign(this.boxes[idx].style, pos);
        });
    };

    addBox = (cursor: any) => {
        // create div element for resize handle
        const box = document.createElement('div');

        // Start with the specified styles
        Object.assign(box.style, this.options.handleStyles);
        box.style.cursor = cursor;

        // Set the width/height to use 'px'
        box.style.width = `${this.options.handleStyles.width}px`;
        box.style.height = `${this.options.handleStyles.height}px`;

        // listen for mousedown on each box
        box.addEventListener('pointerdown', this.handleMousedown, false);
        // add drag handle to document
        this.overlay.appendChild(box);
        // keep track of drag handle
        this.boxes.push(box);
    };

    handleMousedown = (evt: MouseEvent) => {
        // note which box
        this.dragBox = evt.target as HTMLElement;
        // note starting mousedown position
        this.dragStartX = evt.clientX;
        // store the width before the drag
        this.preDragWidth = this.img!.width || this.img!.naturalWidth;
        // set the proper cursor everywhere
        this.setCursor(this.dragBox.style.cursor);

        // disable default behavior of touch gestures on document root, s.t. pointermove gets not interrupted
        document.body.style.touchAction = 'none';
        // listen for movement and mouseup
        document.addEventListener('pointermove', this.handleDrag, false);
        document.addEventListener('pointerup', this.handleMouseup, false);
    };

    handleMouseup = () => {
        // enable default behavior of touch gestures on document root
        document.body.style.touchAction = 'auto';
        // reset cursor everywhere
        this.setCursor('');
        // stop listening for movement and mouseup

        document.removeEventListener('pointermove', this.handleDrag);
        // document.removeEventListener('mouseup', this.handleMouseup);
        document.removeEventListener('pointerup', this.handleMouseup);
    };

    handleDrag = (evt: PointerEvent) => {
        if (!this.img) {
            // image not set yet
            return;
        }
        // update image size
        const deltaX = evt.clientX - this.dragStartX;
        if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) {
            // left-side resize handler; dragging right shrinks image
            this.img.width = Math.round(this.preDragWidth - deltaX);
            this.img.style.width = `${Math.round(this.preDragWidth - deltaX)}px`;
        } else {
            // right-side resize handler; dragging right enlarges image
            this.img.width = Math.round(this.preDragWidth + deltaX);
            this.img.style.width = `${Math.round(this.preDragWidth + deltaX)}px`;
        }
        this.requestUpdate();
    };

    setCursor = (value: string) => {
        [document.body, this.img].forEach((el) => {
            if (el) {
                el.style.cursor = value;
            }
        });
    };
}

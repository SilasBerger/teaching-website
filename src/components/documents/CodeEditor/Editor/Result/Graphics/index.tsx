import * as React from 'react';
import styles from './styles.module.scss';
import { DOM_ELEMENT_IDS } from '@site/src/components/documents/CodeEditor/constants';
import Draggable from 'react-draggable';
import { checkForButtonClick } from '@site/src/components/documents/CodeEditor/Editor/utils/checkForButtonClick';
import Button from '@site/src/components/documents/CodeEditor/Button';
import clsx from 'clsx';
import { DocumentType } from '@site/src/api/document';
import { useDocument } from '@site/src/components/documents/useContextDocument';
import { observer } from 'mobx-react-lite';
import { mdiClose } from '@mdi/js';
export interface Props {
    controls?: JSX.Element;
    main?: JSX.Element;
}
const Graphics = observer((props: Props) => {
    const script = useDocument<DocumentType.Script>();
    const nodeRef = React.useRef(null);
    return (
        <Draggable onStop={checkForButtonClick} positionOffset={{ x: '15%', y: '25%' }} nodeRef={nodeRef}>
            <div className={styles.brythonGraphicsResult} ref={nodeRef}>
                <div className={styles.brythonGraphicsResultHead}>
                    <span>Output</span>
                    <span className={styles.spacer}></span>
                    {props.controls}
                    <Button
                        icon={mdiClose}
                        className={clsx(styles.closeButton)}
                        onClick={() => {
                            script.stopScript();
                            script.closeGraphicsModal();
                        }}
                        iconSize="12px"
                    />
                </div>
                <div
                    id={DOM_ELEMENT_IDS.graphicsResult(script.codeId)}
                    className="brython-graphics-result"
                    key={`exec-${script.graphicsModalExecutionNr}`}
                >
                    {props.main}
                </div>
            </div>
        </Draggable>
    );
});

export default Graphics;

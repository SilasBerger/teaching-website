import * as React from 'react';
import { BRYTHON_NOTIFICATION_EVENT, DOM_ELEMENT_IDS } from '@tdev-components/documents/CodeEditor/constants';
import { useDocument } from '@tdev-hooks/useContextDocument';
import { DocumentType } from '@tdev-api/document';
import { observer } from 'mobx-react-lite';
import { type LogMessage } from '@tdev-models/documents/Script';

const BrythonCommunicator = observer(() => {
    const script = useDocument<DocumentType.Script>();
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const { current } = ref;
        if (!current) {
            return;
        }
        const onBryNotify = (event: { detail?: LogMessage }) => {
            if (event.detail) {
                const data = event.detail as LogMessage;
                switch (data.type) {
                    case 'start':
                        script.clearLogMessages();
                        script.setExecuting(true);
                        break;
                    case 'done':
                        const isRunning = current.getAttribute('data--is-running');
                        if (isRunning) {
                            return;
                        }
                        script.setExecuting(false);
                        break;
                    default:
                        script.addLogMessage({
                            type: data.type,
                            output: data.output,
                            timeStamp: data.timeStamp
                        });
                        break;
                }
            }
        };
        current.addEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
        return () => {
            current.removeEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
        };
    }, [ref, script]);

    return <div id={DOM_ELEMENT_IDS.communicator(script.codeId)} ref={ref}></div>;
});

export default BrythonCommunicator;

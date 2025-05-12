import {
    faCircleNotch,
    faClipboard,
    faClipboardCheck,
    faEllipsisH,
    faTimesCircle,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { toBlob } from 'html-to-image';
// @ts-ignore
import { Options } from 'html-to-image/lib/options';
import * as React from 'react';

interface Props {
    children: JSX.Element;
    options?: Options;
}

type CopyState = 'none' | 'spin' | 'ready' | 'copied' | 'error';

const CopyIcon: { [key in CopyState]: IconDefinition } = {
    none: faEllipsisH,
    copied: faClipboardCheck,
    error: faTimesCircle,
    spin: faCircleNotch,
    ready: faClipboard
};

const CopyClass: { [key in CopyState]: string } = {
    none: 'button--primary',
    ready: 'button--primary',
    error: 'button--danger',
    copied: 'button--success',
    spin: 'button--secondary'
};

const CopyImageToClipboard = ({ children, options }: Props) => {
    const [blob, setBlob] = React.useState<Blob | undefined>(undefined);
    const [copyState, setCopyState] = React.useState<CopyState>('none');
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (['none', 'spin', 'ready'].includes(copyState)) {
            return;
        }
        const timeoutId = setTimeout(() => setCopyState(copyState === 'copied' ? 'ready' : 'none'), 2000);
        return () => clearTimeout(timeoutId);
    }, [copyState]);

    React.useEffect(() => {
        if (copyState !== 'none') {
            setCopyState('none');
        }
    }, [children]);

    return (
        <React.Fragment>
            <button
                className={clsx('button', 'button--outline', 'button--sm', CopyClass[copyState])}
                disabled={copyState === 'spin'}
                onClick={() => {
                    if (ref.current === null) {
                        return;
                    }
                    if (copyState === 'none') {
                        setCopyState('spin');
                        return toBlob(ref.current, options).then((blob) => {
                            setBlob(blob);
                            setCopyState('ready');
                        });
                    }
                    if (copyState !== 'ready') {
                        return;
                    }
                    try {
                        navigator.clipboard
                            .write([
                                new ClipboardItem({
                                    ['image/png']: blob as any
                                })
                            ])
                            .then(() => {
                                setCopyState('copied');
                            })
                            .catch((err) => {
                                setCopyState('error');
                                console.warn(err);
                            });
                    } catch (err) {
                        console.warn(err);
                        setCopyState('error');
                    }
                }}
            >
                <FontAwesomeIcon icon={CopyIcon[copyState]} />
            </button>
            <div ref={ref} className="copy-container">
                {children}
            </div>
        </React.Fragment>
    );
};

export default CopyImageToClipboard;

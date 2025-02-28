import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import React from 'react';
import clsx from 'clsx';
import { ParserResult } from './types';
import ImageCanvas from './ImageCanvas';
import NetpbmGraphic, { MetaInit, ModelMeta } from '@tdev-models/documents/NetpbmGrapic';
import { useFirstMainDocument } from '@tdev-hooks/useFirstMainDocument';
import { Source } from '@tdev-models/iDocument';
import SyncStatus from '@tdev-components/SyncStatus';
import Icon from '@mdi/react';
import { mdiAlertCircle, mdiAlertCircleOutline, mdiCheckAll, mdiFlashTriangle } from '@mdi/js';
import { parse } from './parser/parser';

const StateIcons = observer(({ doc }: { doc: NetpbmGraphic }) => (
    <span className={clsx(styles.stateIcons)}>
        <SyncStatus model={doc} size={0.7} />
        {doc.root?.isDummy && (
            <Icon path={mdiFlashTriangle} size={0.7} color="orange" title="Wird nicht gespeichert." />
        )}
    </span>
));

interface Props extends MetaInit {
    id: string;
    noEditor?: boolean;
}

const NetpbmEditor = observer((props: Props) => {
    const [sanitizedData, setSanitizedData] = React.useState<string>('');
    const [displayedErrors, setDisplayedErrors] = React.useState<(string | React.ReactElement)[]>([]);
    const [displayedWarnings, setDisplayedWarnings] = React.useState<(string | React.ReactElement)[]>([]);
    const [height, setHeight] = React.useState<number>(0);
    const [width, setWidth] = React.useState<number>(0);
    const [pixels, setPixels] = React.useState<Uint8ClampedArray>();

    const [meta] = React.useState(new ModelMeta(props));
    const doc = useFirstMainDocument(props.id, meta);

    React.useEffect(() => {
        const result = doc.data.imageData
            .trim()
            .split('\n')
            .filter((line) => !line.trim().startsWith('#')) // Remove comments.
            .join('\n');

        setSanitizedData(result);
    }, [doc.data.imageData]);

    const resetImageData = React.useMemo(
        () => () => {
            setHeight(0);
            setWidth(0);
            setPixels(new Uint8ClampedArray());
        },
        []
    );

    const resetErrorsAndWarnings = React.useMemo(
        () => () => {
            setDisplayedErrors([]);
            setDisplayedWarnings([]);
        },
        []
    );

    const processParserResult = React.useMemo(
        () => (result: ParserResult) => {
            const { imageData, errors, warnings } = result;
            setDisplayedErrors(errors || []);
            setDisplayedWarnings(warnings || []);
            if (imageData) {
                setHeight(imageData.height);
                setWidth(imageData.width);
                setPixels(imageData.pixels);
            }
        },
        []
    );

    const render = () => {
        resetImageData();
        resetErrorsAndWarnings();
        processParserResult(parse(sanitizedData));
    };

    React.useEffect(() => {
        render();
    }, [sanitizedData]);

    const { hasErrorsOrWarnings, hasWarnings, hasErrors } = React.useMemo(() => {
        return {
            hasErrorsOrWarnings: displayedErrors.length > 0 || displayedWarnings.length > 0,
            hasWarnings: displayedWarnings.length > 0,
            hasErrors: displayedErrors.length > 0
        };
    }, [displayedErrors, displayedWarnings]);

    return (
        <div>
            <div className={clsx(styles.editor, { [styles.hidden]: props.noEditor })}>
                <div className={styles.textAreaWrapper}>
                    <StateIcons doc={doc} />
                    <textarea
                        rows={12}
                        className={clsx(styles.editorTextArea)}
                        onChange={(e) => doc.setData({ imageData: e.target.value }, Source.LOCAL)}
                        value={doc.data.imageData}
                        disabled={props.readonly}
                    />
                </div>
                <div
                    className={clsx(styles.validationWrapper, 'alert', {
                        ['alert--secondary']: !hasErrorsOrWarnings,
                        ['alert--warning']: hasWarnings && !hasErrors,
                        ['alert--danger']: hasErrors
                    })}
                >
                    {!hasErrorsOrWarnings && (
                        <>
                            <span>Keine Fehler gefunden</span>
                            <span className={styles.iconContainer}>
                                <Icon path={mdiCheckAll} size={0.8} />
                            </span>
                        </>
                    )}
                    {hasErrorsOrWarnings && (
                        <details>
                            <summary>
                                {hasErrors && (
                                    <>
                                        <span>Fehler in den Bilddaten</span>
                                        <span className={styles.iconContainer}>
                                            <Icon path={mdiAlertCircle} size={0.8} color="red" />
                                        </span>
                                    </>
                                )}
                                {!hasErrors && hasWarnings && (
                                    <>
                                        <span>Warnungen anzeigen</span>
                                        <span className={styles.iconContainer}>
                                            <Icon path={mdiAlertCircleOutline} size={0.8} color="orange" />
                                        </span>
                                    </>
                                )}
                            </summary>
                            <ul>
                                {displayedWarnings.map((warnung, index) => (
                                    <li key={index}>⚠️ {warnung}</li>
                                ))}
                                {displayedErrors.map((error, index) => (
                                    <li key={index}>❌ {error}</li>
                                ))}
                            </ul>
                        </details>
                    )}
                </div>
            </div>
            <ImageCanvas width={width} height={height} pixels={pixels} />
        </div>
    );
});

export default NetpbmEditor;

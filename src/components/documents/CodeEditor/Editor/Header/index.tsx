import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Reset from '@site/src/components/documents/CodeEditor/Actions/Reset';
import DownloadCode from '@site/src/components/documents/CodeEditor/Actions/DownloadCode';
import ShowRaw from '@site/src/components/documents/CodeEditor/Actions/ShowRaw';
import RunCode from '@site/src/components/documents/CodeEditor/Actions/RunCode';
import { observer } from 'mobx-react-lite';
import { useDocument } from '../../../useContextDocument';
import { DocumentType } from '@site/src/api/document';
import SyncStatus from '@site/src/components/SyncStatus';
import Icon from '@mdi/react';
import { mdiFlashTriangle } from '@mdi/js';

const Header = observer(() => {
    const script = useDocument<DocumentType.Script>();
    const notifyUnpersisted = script.root?.isDummy && !script.meta.slim && !script.meta.hideWarning;
    return (
        <div
            className={clsx(
                styles.controls,
                script.meta.slim && styles.slim,
                notifyUnpersisted && styles.unpersisted
            )}
        >
            {!script.meta.slim && (
                <React.Fragment>
                    <div className={styles.title}>{script.title}</div>
                    <div className={styles.spacer} />
                    {notifyUnpersisted && (
                        <Icon
                            path={mdiFlashTriangle}
                            size={0.7}
                            color="orange"
                            title="Wird nicht gespeichert."
                            className={styles.dummyIndicatorIcon}
                        />
                    )}
                    <div className={styles.spacer} />
                    <SyncStatus model={script} />
                    {script.hasEdits && script.meta.isResettable && <Reset />}
                    {script.meta.canDownload && <DownloadCode title={script.title} />}
                    {script.hasEdits && script.meta.canCompare && <ShowRaw />}
                </React.Fragment>
            )}
            {script.lang === 'python' && <RunCode />}
        </div>
    );
});

export default Header;

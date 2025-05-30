import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ApiState } from '@tdev-stores/iStore';
import Icon from '@mdi/react';
import { mdiContentSaveCheckOutline, mdiContentSaveOffOutline, mdiSync } from '@mdi/js';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface Props {
    model: { state: ApiState };
    size?: string | number | null | undefined;
    className?: string;
}
const SyncStatus = observer((props: Props) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) {
        return null;
    }
    const size = props.size || '1em';

    switch (props.model.state) {
        case ApiState.SYNCING:
            return (
                <Icon
                    path={mdiSync}
                    spin={-2}
                    color="var(--tdev-sync-status-syncinc-color)"
                    size={size}
                    className={props.className}
                />
            );
        case ApiState.SUCCESS:
            return (
                <Icon
                    path={mdiContentSaveCheckOutline}
                    color="var(--tdev-sync-status-success-color)"
                    size={size}
                    className={props.className}
                />
            );
        case ApiState.ERROR:
            return (
                <Icon
                    path={mdiContentSaveOffOutline}
                    color="var(--tdev-sync-status-error-color)"
                    size={size}
                    className={props.className}
                />
            );
    }
    return null;
});

export default SyncStatus;

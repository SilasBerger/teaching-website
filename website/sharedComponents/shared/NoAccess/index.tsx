import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Icon from '@mdi/react';
import { mdiEmoticonSadOutline } from '@mdi/js';

interface Props {
    size?: number;
    header?: string;
    children?: React.ReactNode;
}

const NoAccess = observer((props: Props) => {
    return (
        <div className={clsx(styles.noAccess)}>
            {props.header && <h2 className={clsx(styles.header)}>{props.header}</h2>}
            <div className={clsx(styles.icon)}>
                <Icon path={mdiEmoticonSadOutline} size={props.size || 3} color="var(--ifm-color-primary)" />
            </div>
            <div className={clsx(styles.text)}>Keine Berechtigung</div>
            {props.children}
        </div>
    );
});

export default NoAccess;

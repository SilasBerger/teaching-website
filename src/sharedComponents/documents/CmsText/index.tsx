import { observer } from 'mobx-react-lite';
import { CmsTextContext, useFirstCmsTextDocumentIfExists } from '@tdev-components/documents/CmsText/shared';
import React from 'react';
import CmsActions from './CmsActions';
import { CmsTextEntries } from './WithCmsText';
import { useStore } from '@tdev-hooks/useStore';
import clsx from 'clsx';
import Popup from 'reactjs-popup';

export interface Props {
    id?: string;
    showActions?: boolean;
    name?: string;
    mode?: 'xlsx' | 'code';
}

export const EmptyContent = (props: { className?: string }) => {
    return (
        <Popup
            trigger={<span className={clsx(props.className, 'badge', 'badge--danger')}>-</span>}
            position="top center"
            on="hover"
        >
            <div className={clsx('card')}>
                <div className={clsx('card__body')}>⚠️ Leerer Inhalt</div>
            </div>
        </Popup>
    );
};

const CmsText = observer((props: Props) => {
    const { id, name, showActions } = props;
    const contextId = name ? React.useContext(CmsTextContext)?.entries[name] : undefined;
    const userStore = useStore('userStore');
    const rootId = id || contextId;
    const cmsText = useFirstCmsTextDocumentIfExists(rootId);
    if (!cmsText || (!cmsText.canDisplay && !userStore.isUserSwitched)) {
        return showActions && rootId ? (
            <CmsActions entries={{ [rootId]: rootId } as CmsTextEntries} mode={props.mode} />
        ) : null;
    }

    return (
        <>
            {showActions && rootId && (
                <CmsActions entries={{ [rootId]: rootId } as CmsTextEntries} mode={props.mode} />
            )}
            {cmsText.text}
            {cmsText.text === '' && <EmptyContent />}
        </>
    );
});

export default CmsText;

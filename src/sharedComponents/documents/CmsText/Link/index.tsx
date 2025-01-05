import { observer } from 'mobx-react-lite';
import { CmsTextContext, useFirstCmsTextDocumentIfExists } from '@tdev-components/documents/CmsText/shared';
import React from 'react';
import { Props as DefaultCmsProps, EmptyContent } from '..';
import styles from './styles.module.scss';
import clsx from 'clsx';
import CmsActions from '../CmsActions';
import { CmsTextEntries } from '../WithCmsText';
import { useStore } from '@tdev-hooks/useStore';
import Link from '@docusaurus/Link';

interface Props extends DefaultCmsProps {
    children?: React.ReactNode;
}

const CmsLink = observer((props: Props) => {
    const { id, name, showActions } = props;
    const userStore = useStore('userStore');
    const contextId = name ? React.useContext(CmsTextContext)?.entries[name] : undefined;
    const documentRootId = id || contextId;
    const cmsText = useFirstCmsTextDocumentIfExists(documentRootId);
    const actionEntries =
        showActions && documentRootId ? ({ [documentRootId]: documentRootId } as CmsTextEntries) : undefined;
    if (!cmsText || (!cmsText.canDisplay && !userStore.isUserSwitched)) {
        return actionEntries ? (
            <CmsActions entries={actionEntries} className={clsx(styles.codeBlock)} mode="code" />
        ) : null;
    }
    if (actionEntries) {
        return (
            <div className={clsx(styles.container)}>
                <CmsActions entries={actionEntries} className={clsx(styles.codeBlock)} mode="code" />
                <Link to={cmsText.text}>{props.children || cmsText.text}</Link>
            </div>
        );
    }

    return (
        <Link to={cmsText.text}>
            {props.children || cmsText.text}
            {cmsText.text === '' && <EmptyContent />}
        </Link>
    );
});

export default CmsLink;

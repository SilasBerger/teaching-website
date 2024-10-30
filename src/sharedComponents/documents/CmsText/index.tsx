import { observer } from 'mobx-react-lite';
import { CmsTextContext, useFirstCmsTextDocumentIfExists } from '@tdev-components/documents/CmsText/shared';
import React from 'react';

interface Props {
    id?: string;
    name?: string;
}

const CmsText = observer(({ id, name }: Props) => {
    const contextId = name ? React.useContext(CmsTextContext)?.entries[name] : undefined;
    const cmsText = useFirstCmsTextDocumentIfExists(id || contextId)?.text;

    return cmsText ? (
        <>
            <span>{cmsText}</span>
        </>
    ) : (
        <></>
    );
});

export default CmsText;

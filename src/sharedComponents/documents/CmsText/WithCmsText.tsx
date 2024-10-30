import { CmsTextContext, useFirstCmsTextDocumentIfExists } from '@tdev-components/documents/CmsText/shared';
import { observer } from 'mobx-react-lite';

interface Props {
    entries: { [key: string]: string };
    children?: React.ReactNode;
}

const WithCmsText = observer(({ entries, children }: Props) => {
    const allDocumentsAvailable = Object.values(entries)
        .map((documentRootId) => !!useFirstCmsTextDocumentIfExists(documentRootId))
        .every(Boolean);

    return allDocumentsAvailable ? (
        <CmsTextContext.Provider value={{ entries }}>{children}</CmsTextContext.Provider>
    ) : (
        <></>
    );
});

export default WithCmsText;

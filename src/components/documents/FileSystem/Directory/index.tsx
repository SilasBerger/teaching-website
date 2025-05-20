import React from 'react';
import { observer } from 'mobx-react-lite';
import { ModelMeta } from '@tdev-models/documents/FileSystem/Directory';
import { MetaInit } from '@tdev-models/documents/FileSystem/iFileSystem';
import { useFirstMainDocument } from '@tdev-hooks/useFirstMainDocument';
import Loader from '@tdev-components/Loader';
import { useClientLib } from '@tdev-hooks/useClientLib';
import type { default as DirectoryComponentType } from '@tdev-components/documents/FileSystem/Directory/Directory';

interface Props extends MetaInit {
    id: string;
}

const Directory = observer((props: Props) => {
    const [meta] = React.useState(new ModelMeta(props));
    const doc = useFirstMainDocument(props.id, meta);
    const DirectoryComponent = useClientLib<typeof DirectoryComponentType>(
        () => import('@tdev-components/documents/FileSystem/Directory/Directory').then((d) => d.default),
        '@tdev-components/documents/FileSystem/Directory/Directory'
    );
    if (!doc || !DirectoryComponent) {
        return <Loader />;
    }
    return <DirectoryComponent dir={doc} />;
});

export default Directory;

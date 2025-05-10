import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useFirstMainDocument } from '@tdev-hooks/useFirstMainDocument';
import Loader from '@tdev-components/Loader';

interface Props extends MetaInit {
    id: string;
}

const Component = observer((props: Props) => {
    const [meta] = React.useState(new ModelMeta(props));
    const doc = useFirstMainDocument(props.id, meta);
    if (!doc) {
        return <Loader />;
    }
    return <div></div>;
});

export default Component;

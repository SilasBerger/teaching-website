import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

interface Props {
    children: React.ReactNode;
    inMdxEditor?: boolean;
}

const Steps = observer((props: Props) => {
    return <div className={clsx(styles.steps, props.inMdxEditor && styles.mdxEditor)}>{props.children}</div>;
});

export default Steps;

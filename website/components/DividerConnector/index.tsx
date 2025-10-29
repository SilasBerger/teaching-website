import clsx from 'clsx';
import styles from './styles.module.scss';
import Icon from '@mdi/react';
import { mdiArrowDownBold } from '@mdi/js';

interface Props {
    containerProps: any;
    iconProps: any;
}

const DividerConnector = ({ containerProps = {}, iconProps = {} }: Props) => {
    return (
        <div className={clsx(styles.container)} {...containerProps}>
            <Icon path={mdiArrowDownBold} size={4} {...iconProps} />
        </div>
    );
};

export default DividerConnector;

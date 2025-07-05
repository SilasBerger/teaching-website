import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { JsTypeName } from '../../../toJsSchema';
import Button from '@tdev-components/shared/Button';
import { SIZE_XS } from '@tdev-components/shared/iconSizes';
import { ColorMap } from '../../JsType';
import { action } from 'mobx';
import { IconMap } from '../AddValue';
import iJs from '../../models/iJs';

interface Props {
    js: iJs;
}

const ChangeType = observer((props: Props) => {
    const { js } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className={clsx(styles.changeType, isOpen && styles.open)}>
            {isOpen && (
                <>
                    {(
                        ['string', 'number', 'array', 'object', 'boolean', 'nullish'].filter(
                            (i) => i !== js.type
                        ) as JsTypeName[]
                    ).map((type) => (
                        <Button
                            key={type}
                            size={SIZE_XS}
                            color={ColorMap[type]}
                            icon={IconMap[type]}
                            iconSide="left"
                            className={clsx(styles.changeTypeButton)}
                            onClick={action((e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                js.changeType(type);
                            })}
                        />
                    ))}
                </>
            )}
            <Button
                size={SIZE_XS}
                icon={IconMap[js.type]}
                color={ColorMap[js.type]}
                className={clsx(styles.changeTypeButton)}
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
                active={isOpen}
            />
        </div>
    );
});

export default ChangeType;

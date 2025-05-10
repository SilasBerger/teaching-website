import * as React from 'react';
import Typed from 'typed.js';
import styles from '@docusaurus/theme-classic/src/theme/Heading/styles.module.css';
import clsx from 'clsx';

interface Props {
    type: keyof React.ReactHTML;
    strings: string[];
}

const TypedText = (props: Props) => {
    // typed: Typed;
    const [typed, setTyped] = React.useState<Typed>();
    const typedRef = React.createRef<HTMLElement>();
    React.useEffect(() => {
        const { strings } = props;
        const options = {
            strings: strings,
            typeSpeed: 50,
            backSpeed: 50,
            loop: true
        };
        setTyped(new Typed(typedRef.current, options));
        return () => {
            if (typed) {
                typed.stop();
                typed.destroy();
            }
        };
    }, [typedRef?.current, props.strings]);

    const span = React.createElement('span', { ref: typedRef, style: { whiteSpace: 'pre' }, key: '1' });
    const cls = props.type === 'h1' ? clsx('type-wrap', styles.h1Heading) : 'type-wrap';
    const TypedElem = React.createElement(props.type, { className: cls, children: [span] });
    return <div className="wrap">{TypedElem}</div>;
};
export default TypedText;

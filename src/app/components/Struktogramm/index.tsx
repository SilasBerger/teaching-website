import * as React from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';

interface Base {
    code: string;
    block?: CodeLine[];
}

interface CodeLine extends Base {
    type: 'step' | 'repeat' | 'def' | 'call' | 'statement' | 'if' | 'elif' | 'else' | 'input';
}

interface Props {
    program: CodeLine[];
}

const Step = (props: Base) => {
    return <div className={styles.step}>{props.code}</div>;
};
const Call = (props: Base) => {
    return <div className={clsx(styles.call, styles.step, styles.bordered)}>{props.code}</div>;
};
const Statement = (props: Base) => {
    return <div className={clsx(styles.step, styles.statement)}>{props.code}</div>;
};
const Repeat = (props: Base) => {
    return (
        <div className={clsx(styles.repeat, styles.step, styles.indent)}>
            <div className={styles.header}>{props.code}</div>
            <div className={styles.body}>{props.block && <Struktogramm program={props.block} />}</div>
        </div>
    );
};
const Def = (props: Base) => {
    return (
        <div className={clsx(styles.def, styles.step, styles.indent)}>
            <div className={styles.header}>{props.code}</div>
            <div className={styles.body}>{props.block && <Struktogramm program={props.block} />}</div>
        </div>
    );
};
const Input = (props: Base) => {
    return <div className={clsx(styles.input, styles.step)}>{props.code}</div>;
};
const If = (props: Base) => {
    return (
        <div className={clsx(styles.if, styles.step, styles.indent)}>
            <div className={styles.header}>{props.code}</div>
            <div className={styles.body}>{props.block && <Struktogramm program={props.block} />}</div>
        </div>
    );
};

const Else = (props: Base) => {
    return (
        <div className={clsx(styles.else, styles.step)}>
            <div className={styles.header}>{props.code}</div>
            <div className={styles.body}>{props.block && <Struktogramm program={props.block} />}</div>
        </div>
    );
};

const Struktogramm = (props: Props) => {
    return (
        <div className={styles.strukto}>
            {props.program.map((codeLine, idx) => {
                switch (codeLine.type) {
                    case 'call':
                        return <Call key={idx} code={codeLine.code} />;
                    case 'def':
                        return <Def key={idx} code={codeLine.code} block={codeLine.block} />;
                    case 'repeat':
                        return <Repeat key={idx} code={codeLine.code} block={codeLine.block} />;
                    case 'step':
                        return <Step key={idx} code={codeLine.code} />;
                    case 'statement':
                        return <Statement key={idx} code={codeLine.code} />;
                    case 'input':
                        return <Input key={idx} code={codeLine.code} />;
                    case 'if':
                        return <If key={idx} code={codeLine.code} block={codeLine.block} />;
                    case 'elif':
                    case 'else':
                        return (
                            <Else
                                key={idx}
                                code={codeLine.code || (codeLine.type === 'else' ? 'Sonst' : '')}
                                block={codeLine.block}
                            />
                        );
                }
            })}
        </div>
    );
};

export default Struktogramm;

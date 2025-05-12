import clsx from 'clsx';
import * as React from 'react';
import styles from './index.module.scss';
import containerStyles from '../styles/container.module.scss';
import {
    CHECKER_DICTIONARY,
    DICTIONARY,
    LEVEL_MAP,
    NAMED_NUMBER_DICTIONARY,
    PERIOD_DICTIONARY,
} from '../../helpers/password-checker';
import { loadJS } from '../../helpers/loaders';

const LEVEL_CLASSES = {
    0: styles.achievement,
    1: styles.notice,
    2: styles.warning,
    3: styles.insecure,
};

const LEVEL_BADGE_MAPPING = {
    0: 'badge--success',
    1: 'badge--primary',
    2: 'badge--warning',
    3: 'badge--danger',
};

const formatTime = (time?: string) => {
    if (time && time !== 'sofort' && time !== 'nie') {
        return `in ${time}`;
    }
    return time;
};

const PasswordChecker = () => {
    const ref = React.useRef<HTMLInputElement>(null);
    const [hsimp, setHsimp] = React.useState(false);
    const [level, setLevel] = React.useState(1);
    const [zeros, setZeros] = React.useState('');
    const [time, setTime] = React.useState('');
    const [checks, setChecks] = React.useState([]);
    const [pw, setPw] = React.useState('');
    React.useEffect(() => {
        loadJS('/js/hsimp.min.js').then(() => {
            const lib = (window as any).hsimp;
            lib.setDictionary(DICTIONARY);
            lib.setPeriodDictionary(PERIOD_DICTIONARY);
            lib.setNamedNumberDictionary(NAMED_NUMBER_DICTIONARY);
            lib.setCheckerDictionary(CHECKER_DICTIONARY);
            setHsimp(true);
        });
    }, []);

    React.useEffect(() => {
        if (!hsimp || !ref.current || !pw) {
            setTime('');
            return;
        }
        const options = {
            outputTime: (t: string, input: string) => {
                setTime(t);
            },
            outputChecks: (checks: any[], input: string) => {
                let level = 0;
                checks.forEach((check) => {
                    level = Math.max(level, LEVEL_MAP[check.level]);
                });
                if (!input) {
                    level = 1;
                }
                setLevel(level);
                setChecks(checks);
            },
        };
        (window as any).hsimp(options, ref.current);
    }, [pw, hsimp, ref]);

    React.useEffect(() => {
        if (!time) {
            return setZeros('');
        }
        const parts = time.split(' ');
        const unit = parts[parts.length - 1];
        const si = parts[parts.length - 2];
        const num = parts[parts.length - 3];
        const z = NAMED_NUMBER_DICTIONARY[si];
        if (num === undefined || z === undefined || z < 10) {
            setZeros('');
        } else {
            const zahl = num.padEnd(z + num.length, '0');
            const fZahl = zahl.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
            setZeros(`${fZahl} ${unit}`);
        }
    }, [time]);

    return (
        <div
            className={clsx(
                'hero',
                'shadow--lw',
                containerStyles.container,
                styles.pwContainer,
                LEVEL_CLASSES[level]
            )}
        >
            <p className="hero__subtitle">Passwort Checker</p>
            <h4>Wie sicher ist mein Passwort?</h4>
            <input placeholder="Passwort" ref={ref} type="password" onChange={(e) => setPw(e.target.value)} />
            {time && <span className={clsx('badge', LEVEL_BADGE_MAPPING[level])}>{time}</span>}
            {time && (
                <div>
                    Ein Computer kann das eingegebene Passwort <b>{formatTime(time)}</b> erraten.
                </div>
            )}
            {zeros && <div className={clsx(styles.zeros)}>(in {zeros}.)</div>}
            <div>
                <ul>
                    {checks.map((check, idx) => (
                        <li key={idx}>
                            <b>{check.name}</b>: {check.message}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={clsx(styles.note)}>
                * Die eingegebenen Passwörter werden direkt auf Ihrem Gerät analysiert und werden weder
                gespeichert noch übers Internet verschickt.
            </div>
        </div>
    );
};

export default PasswordChecker;

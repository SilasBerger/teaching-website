import { faClock, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import * as React from 'react';
import styles from '../styles.module.scss';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CopyImageToClipboard from "@site/src/components/shared/CopyImageToClipboard";
import {randomPrime} from "@site/src/utils/prime";
import {useStore} from "@site/src/hooks/useStore";
import {action} from "mobx";

interface StageProps {
  onStage: () => any;
  label: string;
  result: { calculations: string[]; time_ms?: number };
}

const Stage = (props: StageProps) => {
  return (
    <>
      <div className={clsx(styles.stage)}>
        <h4>{props.label}</h4>
        <span style={{ flexGrow: 1 }} />
        <button className="button button--success button--sm" onClick={props.onStage}>
          <FontAwesomeIcon icon={faPlay} color="white" />
        </button>
      </div>
      <div className={clsx(styles.result)}>
        {props.result.calculations.map((calc, idx) => {
          return (
            <span className={clsx('badge', 'badge--secondary', styles.badge)} key={idx}>
                            {calc}
                        </span>
          );
        })}
        <span style={{ flexGrow: 1 }} />
        {props.result.time_ms !== undefined && (
          <span className={clsx('badge', 'badge--success', styles.badge)}>
                        <FontAwesomeIcon icon={faClock} /> {props.result.time_ms.toFixed(1)} ms
                    </span>
        )}
      </div>
    </>
  );
};

const hNumber = (num: number) => {
  return num.toLocaleString().replace(/[\.,]/g, "'");
};

const DEFAULT_RESULT = { calculations: [] };

const tickFormatter = (tick: number) => {
  if (tick < 1000) {
    return tick;
  }
  const pot10 = `${tick}`.length - 1;
  const num = `${tick}`.replace(/0*$/, '');
  const one = num.slice(0, 1);
  const rest = num.slice(1);
  if (one === '1') {
    return `10^${pot10}`;
  }
  if (!rest) {
    return `${num.slice(0, 1)}·10^${pot10}`;
  }
  return `${num.slice(0, 1)}.${num.slice(1)}·10^${pot10}`;
};

const PrimefactorizationTiming = () => {
  const [digits, setDigits] = React.useState(6);
  const [range, setRange] = React.useState([0, 0]);
  const [stage, setStage] = React.useState(0);
  const [prime1, setPrime1] = React.useState<number>(0);
  const [prime2, setPrime2] = React.useState<number>(0);
  const [tPrime, set_tPrime] = React.useState<number>(-1);
  const [measurements, setMeasures] = React.useState<{ product: number; time: number }[]>([]);
  const [prod, setProd] = React.useState<number>(0);
  const [tMult, set_tMult] = React.useState<number>(-1);
  const [tFact, set_tFact] = React.useState<number>(-1);
  const [factPrime1, setFactPrime1] = React.useState<number>(0);
  const [factPrime2, setFactPrime2] = React.useState<number>(0);
  const store = useStore('toolsStore');

  React.useEffect(() => {
    setDigits(store.primeFactorizationTiming?.digits || 6);
    setRange(store.primeFactorizationTiming?.range || [0, 0]);
    setStage(store.primeFactorizationTiming?.stage || 0);
    setPrime1(store.primeFactorizationTiming?.prime1 || 0);
    setPrime2(store.primeFactorizationTiming?.prime2 || 0);
    set_tPrime(store.primeFactorizationTiming?.tPrime || 1);
    setMeasures(store.primeFactorizationTiming?.measurements || []);
    setProd(store.primeFactorizationTiming?.prod || 0);
    set_tMult(store.primeFactorizationTiming?.tMult || -1);
    set_tFact(store.primeFactorizationTiming?.tFact || -1);
    setFactPrime1(store.primeFactorizationTiming?.factPrime1 || 0);
    setFactPrime2(store.primeFactorizationTiming?.factPrime2 || 0);
  }, []);

  React.useEffect(() => {
    return action(() => {
      store.primeFactorizationTiming = {
        digits,
        range,
        stage,
        prime1,
        prime2,
        tPrime,
        measurements,
        prod,
        tMult,
        tFact,
        factPrime1,
        factPrime2,
      };
    });
  }, [digits, range, stage, prime1, prime2, tPrime, measurements, prod, tMult, tFact, factPrime1, factPrime2]);

  React.useEffect(() => {
    setStage(0);
    if (digits < 8) {
      setRange([
        Number.parseInt('5'.padEnd(digits, '0'), 10),
        Number.parseInt('5'.padEnd(digits + 1, '0'), 10),
      ]);
    } else if (digits === 8) {
      setRange([
        Number.parseInt('5'.padEnd(digits, '0'), 10),
        Number.parseInt('1'.padEnd(digits + 1, '0'), 10),
      ]);
    }
  }, [digits]);

  React.useEffect(() => {
    if (stage === 3) {
      setMeasures([...measurements, { product: prod, time: tFact }]);
    }
  }, [stage]);

  const onStage1 = () => {
    const t0 = window.performance.now();
    const p1 = randomPrime(range[0], range[1]);
    const p2 = randomPrime(range[0], range[1]);
    setPrime1(Math.min(p1, p2));
    setPrime2(Math.max(p1, p2));
    const ellapsed = window.performance.now() - t0;
    set_tPrime(ellapsed);
    setStage(1);
  };

  const onStage2 = () => {
    const t0 = window.performance.now();
    setProd(prime1 * prime2);
    const ellapsed = window.performance.now() - t0;
    set_tMult(ellapsed);
    setStage(2);
  };

  const onStage3 = () => {
    set_tFact(-1);
    const t0 = window.performance.now();
    let n = 2;
    while (n < prod) {
      const r = prod / n;
      if (r % 1 === 0) {
        setFactPrime1(n);
        setFactPrime2(r);
        break;
      }
      if (n === 2) {
        n++;
      } else {
        n += 2;
      }
    }
    const ellapsed = window.performance.now() - t0;
    set_tFact(ellapsed);
    setStage(3);
  };

  // @ts-ignore
  return (
    <div className={clsx('hero', 'shadow--lw', styles.container, styles.factorization)}>
      <div className="container">
        <p className="hero__subtitle">Zeitanalyse Primfaktorzerlegung</p>
        Primzahlen mit
        <div className={clsx('button-group', styles.digits)}>
          <button
            className={clsx(
              'button',
              'button--sm',
              'button--outline',
              'button--primary',
              digits === 6 && 'button--active'
            )}
            onClick={() => setDigits(6)}
          >
            6
          </button>
          <button
            className={clsx(
              'button',
              'button--sm',
              'button--outline',
              'button--primary',
              digits === 7 && 'button--active'
            )}
            onClick={() => setDigits(7)}
          >
            7
          </button>
          <button
            className={clsx(
              'button',
              'button--sm',
              'button--outline',
              'button--primary',
              digits === 8 && 'button--active'
            )}
            onClick={() => setDigits(8)}
          >
            8
          </button>
        </div>
        Stellen
        <Stage
          onStage={onStage1}
          label={`Zwei Primzahlen zwischen ${hNumber(range[0])} und ${hNumber(range[1])} wählen`}
          result={
            stage > 0
              ? {
                calculations: [hNumber(prime1), hNumber(prime2)],
                time_ms: tPrime,
              }
              : DEFAULT_RESULT
          }
        />
        {stage > 0 && (
          <Stage
            onStage={onStage2}
            label={`Primzahlprodukt berechnen: ${hNumber(prime1)} * ${hNumber(prime2)}`}
            result={
              stage > 1
                ? {
                  calculations: [hNumber(prod)],
                  time_ms: tMult,
                }
                : DEFAULT_RESULT
            }
          />
        )}
        {stage > 1 && (
          <Stage
            onStage={onStage3}
            label={`Primzahlen faktorisieren`}
            result={
              stage > 2
                ? {
                  calculations: [hNumber(factPrime1), hNumber(factPrime2)],
                  time_ms: tFact,
                }
                : DEFAULT_RESULT
            }
          />
        )}
        {measurements.length > 0 && (
          <div style={{ width: '100%', overflow: 'auto' }}>
            <CopyImageToClipboard>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                  width={500}
                  height={300}
                  margin={{
                    top: 5,
                    right: 100,
                    bottom: 80,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis
                    type="number"
                    dataKey="product"
                    name="Produkt"
                    // @ts-ignore
                    tickFormatter={tickFormatter}
                    angle={40}
                    textAnchor="start"
                  />
                  <YAxis type="number" dataKey="time" name="Zeit" unit="ms" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Mesurements" data={measurements} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CopyImageToClipboard>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrimefactorizationTiming;

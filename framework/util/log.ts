import process from 'process';
import { toNumber } from 'lodash';

export enum LogLevel {
    WARN,
    INFO,
    DEBUG
}

export class Log {
    private static _instance: Log;

    constructor(private _logLevel: LogLevel) {}

    static get instance(): Log {
        if (!Log._instance) {
            const logLevelEnv = process.env.LOG_LEVEL;
            const logLevel = logLevelEnv ? toNumber(logLevelEnv) : LogLevel.INFO;
            Log._instance = new Log(logLevel);
        }
        return Log._instance;
    }

    warn(msg: string) {
        if (this._logLevel >= LogLevel.WARN) {
            console.warn(`[WARN] ${msg}`);
        }
    }

    info(msg: string) {
        if (this._logLevel >= LogLevel.INFO) {
            console.log(`[INFO] ${msg}`);
        }
    }

    debug(msg: string) {
        if (this._logLevel >= LogLevel.DEBUG) {
            console.log(`[DEBUG] ${msg}`);
        }
    }
}

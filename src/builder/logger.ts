import process from "process";
import {toNumber} from "lodash";

export enum LogLevel {
  WARN ,
  INFO,
  DEBUG,
}

export class Logger {

  private static _instance: Logger;

  constructor(private _logLevel: LogLevel) {
  }

  static get instance(): Logger {
    if (!Logger._instance) {
      const logLevelEnv = process.env.LOG_LEVEL;
      const logLevel = logLevelEnv ? toNumber(logLevelEnv) : LogLevel.INFO;
      Logger._instance = new Logger(logLevel);
    }
    return Logger._instance;
  }

  warn(msg: string) {
    if (this._logLevel >= LogLevel.WARN) {
      console.log(`[WARN] ${msg}`);
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

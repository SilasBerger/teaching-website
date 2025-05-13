import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export function expandTilde(filePath: string): string {
    if (filePath[0] === '~') {
        return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
}

export class ReportBuilder {
    buffer = '';

    constructor(
        private reportDirPath: string,
        private reportFilename: string
    ) {}

    appendLine(line: string): ReportBuilder {
        this.buffer += `${line}\n`;
        return this;
    }

    write() {
        if (!this.buffer) {
            console.log('Nothing to report, no log file created.');
        }

        fs.mkdirSync(this.reportDirPath, { recursive: true });
        fs.writeFileSync(this.reportFilename, this.buffer);

        console.log('\n---------- Report ----------');
        console.log(this.buffer);
        console.log(`👉 Report file: ${this.reportFilename}`);
        console.log('----------------------------');
    }
}

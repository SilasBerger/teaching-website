import * as fs from 'fs';

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
            console.log('👍  Nothing to report, no log file created.');
            return;
        }
        fs.mkdirSync(this.reportDirPath, { recursive: true });
        fs.writeFileSync(this.reportFilename, this.buffer);

        console.log('\n---------- Report ----------');
        console.log(this.buffer);
        console.log(`👉 Report file: ${this.reportFilename}`);
        console.log('----------------------------');
    }
}

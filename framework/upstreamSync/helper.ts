import * as path from 'path';
import * as os from 'os';

export function expandTilde(filePath: string): string {
    if (filePath[0] === '~') {
        return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
}

import fs from 'fs';

export const ensurePath = (path: string, recursive: boolean = false) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive });
    }
};

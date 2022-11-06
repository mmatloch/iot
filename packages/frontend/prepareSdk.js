import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const sdkLocation = path.resolve('./src/definitions/eventSdk.d.ts');

const rawContent = fs.readFileSync(sdkLocation, { encoding: 'utf-8' }).split(os.EOL);

const updatedContent = rawContent
    .filter((line) => {
        if (line.startsWith('declare module')) {
            return false;
        }

        if (line === '}') {
            return false;
        }

        if (line.includes('import ')) {
            return false;
        }

        return true;
    })
    .join(os.EOL);

const declareSdkAsGlobal = (content) => {
    return content.replace('export interface Sdk', 'declare var sdk:');
};

const removeExports = (content) => {
    return content.replaceAll('export ', 'declare ');
};

fs.writeFileSync(sdkLocation, removeExports(declareSdkAsGlobal(updatedContent)), { encoding: 'utf-8' });

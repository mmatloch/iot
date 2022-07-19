import { argv, glob, os, path } from 'zx';

import { multilinePrint, print } from './utils/print.mjs';

const SCRIPTS_DIR = __dirname;
const SCRIPTS_EXT = 'mjs';

const getAvailableScripts = async () => {
    const scripts = await glob(path.join(SCRIPTS_DIR, `*.${SCRIPTS_EXT}`));

    return scripts
        .map((script) => script.replace(`${SCRIPTS_DIR}/`, '').replace(`.${SCRIPTS_EXT}`, ''))
        .filter((script) => script !== 'index'); // this script
};

export const parseInput = () => {
    const { _, ...params } = argv;

    const [scriptName] = _;
    const [moduleName, command] = scriptName.split(':');

    if (command) {
        return {
            scriptName: moduleName,
            scriptParams: params,
            command,
        };
    }

    return {
        scriptName,
        scriptParams: params,
        command: 'default',
    };
};

const main = async () => {
    const availableScripts = await getAvailableScripts();

    const { scriptName, command, scriptParams } = parseInput();

    if (availableScripts.includes(scriptName)) {
        const scriptPath = path.join(SCRIPTS_DIR, `${scriptName}.${SCRIPTS_EXT}`);

        const module = await import(scriptPath);
        const commandFn = module[command];

        if (typeof commandFn !== 'function') {
            throw new Error(`Command "${command}" doesn't exist in script "${scriptName}"`);
        }

        try {
            await commandFn(scriptParams);
        } catch (e) {
            console.log(e);
            process.exit(e.exitCode);
        }

        return;
    }

    const msg = [
        `Usage: yarn script <scriptName> [<args>] ${os.EOL}`,
        `Script "${scriptName}" doesn't exist.`,
        `Available scripts:`,
        ...availableScripts.map((s) => ` * ${s}`),
    ];

    multilinePrint(msg, 'red');
};

// https://github.com/google/zx/blob/main/docs/known-issues.md#colors-in-subprocess
process.env.FORCE_COLOR = '1';

try {
    await main();
} catch (e) {
    print(e, 'red');
}

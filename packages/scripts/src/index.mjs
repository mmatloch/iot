import { $, argv, glob, os, path } from 'zx';

import { multilinePrint, print } from './utils/print.mjs';

const SCRIPTS_DIR = __dirname;
const SCRIPTS_EXT = 'mjs';

const parseInput = () => {
    const { _, ...scriptParams } = argv;

    return {
        scriptName: _[1], // the first element is the path to the script
        scriptParams,
    };
};

const serializeParams = (params) => {
    return Object.entries(params).map(([key, value]) => `--${key}=${value}`);
};

const getAvailableScripts = async () => {
    const scripts = await glob(path.join(SCRIPTS_DIR, `*.${SCRIPTS_EXT}`));

    return scripts
        .map((script) => script.replace(`${SCRIPTS_DIR}/`, '').replace(`.${SCRIPTS_EXT}`, ''))
        .filter((script) => script !== 'index'); // this script
};

const main = async () => {
    const availableScripts = await getAvailableScripts();

    const { scriptName, scriptParams } = parseInput();

    if (availableScripts.includes(scriptName)) {
        scriptParams.experimental = true;

        const scriptPath = path.join(SCRIPTS_DIR, `${scriptName}.${SCRIPTS_EXT}`);

        // https://github.com/google/zx/blob/main/docs/known-issues.md#colors-in-subprocess
        process.env.FORCE_COLOR = '1';

        try {
            return await $`zx ${scriptPath} ${serializeParams(scriptParams)}`;
        } catch (e) {
            return print(e, 'red');
        }
    }

    const msg = [
        `Usage: yarn script <scriptName> [<args>] ${os.EOL}`,
        `Script "${scriptName}" doesn't exist.`,
        `Available scripts:`,
        ...availableScripts.map((s) => ` * ${s}`),
    ];

    multilinePrint(msg, 'red');
};

await main();

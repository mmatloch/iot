import { chalk, os } from 'zx';

export const print = (msg, color) => {
    if (color) {
        console.log(chalk[color](msg));
    } else {
        console.log(msg);
    }
};

export const multilinePrint = (messages, ...args) => {
    print(messages.join(os.EOL), ...args);
};

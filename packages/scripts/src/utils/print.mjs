import { chalk, echo, os } from 'zx';

export const print = (msg, color) => {
    if (color) {
        echo(chalk[color](msg));
    } else {
        echo(msg);
    }
};

export const multilinePrint = (messages, ...args) => {
    print(messages.join(os.EOL), ...args);
};

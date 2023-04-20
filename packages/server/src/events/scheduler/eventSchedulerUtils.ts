export const startLoop = (cb: () => void, timeoutFn: () => number) => {
    setTimeout(() => {
        cb();
        startLoop(cb, timeoutFn);
    }, timeoutFn());
};

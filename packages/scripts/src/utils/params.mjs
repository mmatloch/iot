import { argv } from 'zx';

export const serializeParams = (params) => {
    return Object.entries(params).map(([key, value]) => `--${key}=${value}`);
};

export const parseInput = () => {
    const { _, ...params } = argv;

    return {
        argv: _, // the first element is the path to the script
        params,
    };
};

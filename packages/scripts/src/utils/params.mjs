export const serializeParams = (params) => {
    return Object.entries(params).map(([key, value]) => `--${key}=${value}`);
};

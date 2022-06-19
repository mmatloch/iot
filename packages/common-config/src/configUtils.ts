export const schemaPtrToConfigPtr = (jsonPtr: string) => {
    const keywordsToFilter = ['properties', 'items'];

    const configPtr = jsonPtr
        .split('/')
        .filter((c) => {
            if (!c || keywordsToFilter.includes(c)) {
                return false;
            }

            return true;
        })
        .join('/');

    return `/${configPtr}`;
};

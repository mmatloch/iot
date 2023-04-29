const ICON_PREFIX = '/api/static';

export const buildIconUrl = (iconName: string) => {
    return `${ICON_PREFIX}/${iconName}`;
};

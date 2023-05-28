import { buildIconUrl } from '@utils/buildIconUrl';

export const useIcon = (iconName: string) => {
    return buildIconUrl(iconName);
};

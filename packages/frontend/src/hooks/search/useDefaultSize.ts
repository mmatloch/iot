import { useMediaQuery, useTheme } from '@mui/material';

export interface DefaultSizeMap {
    md: number;
    lg: number;
}

export function useDefaultSize(sizeMap: DefaultSizeMap) {
    const theme = useTheme();

    const isLargeMedia = useMediaQuery(theme.breakpoints.up('lg'));

    if (isLargeMedia) {
        return sizeMap.lg;
    }

    return sizeMap.md;
}

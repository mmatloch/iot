import { useMediaQuery, useTheme } from '@mui/material';

export function useDefaultSize() {
    const theme = useTheme();

    const isLargeMedia = useMediaQuery(theme.breakpoints.up('lg'));

    if (isLargeMedia) {
        return 9;
    }

    return 10;
}

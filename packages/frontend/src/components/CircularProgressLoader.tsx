import { Box, CircularProgress, Grid } from '@mui/material';

interface Props {
    variant: 'center' | 'normal';
}

export default function CircularProgressLoader({ variant }: Props) {
    if (variant === 'center') {
        return (
            <Grid container direction="column" alignItems="center" justifyContent="center">
                <Grid item>
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                </Grid>
            </Grid>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    );
}

import { Grid } from '@mui/material';

import CircularProgressLoader from './CircularProgressLoader';

export default function FullScreenLoader() {
    return (
        <div>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item>
                    <CircularProgressLoader />
                </Grid>
            </Grid>
        </div>
    );
}

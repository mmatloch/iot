import { Grid } from '@mui/material';

import SignInCard from '../features/auth/components/SignInCard';

export default function AuthSignIn() {
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
                    <SignInCard />
                </Grid>
            </Grid>
        </div>
    );
}

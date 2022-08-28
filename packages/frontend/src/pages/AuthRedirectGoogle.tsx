import RedirectGoogle from '@features/auth/components/Redirect';
import RedirectCard from '@features/auth/components/RedirectCard';
import { Grid } from '@mui/material';

export default function AuthRedirectGoogle() {
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
                    <RedirectCard>
                        <RedirectGoogle />
                    </RedirectCard>
                </Grid>
            </Grid>
        </div>
    );
}

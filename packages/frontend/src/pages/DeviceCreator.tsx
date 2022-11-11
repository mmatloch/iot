import AddDeviceStepper from '@features/devices/components/AddDeviceStepper';
import Layout from '@layout/Layout';
import { Container, Grid, Paper, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function DeviceCreator() {
    const { t } = useTranslation();

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        {t('devices:creator.title')}
                    </Typography>
                </Toolbar>

                <Paper>
                    <Grid container direction="column" alignItems="center" sx={{ py: 5 }}>
                        <Grid item sx={{ pt: 8 }}>
                            <AddDeviceStepper />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Layout>
    );
}

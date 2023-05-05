import AddDeviceStepper from '@features/devices/components/AddDeviceStepper';
import Layout from '@layout/Layout';
import { Box, Container, Paper, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function DeviceCreator() {
    const { t } = useTranslation('devices');

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        {t('creator.title')}
                    </Typography>
                </Toolbar>

                <Paper>
                    <Box sx={{ py: 5, mx: 2 }}>
                        <AddDeviceStepper />
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
}

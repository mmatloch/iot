import { useDevices } from '@api/devicesApi';
import ErrorDialog from '@components/ErrorDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { Device } from '@definitions/entities/deviceTypes';
import AddDeviceStepper from '@features/devices/components/AddDeviceStepper';
import DeviceCard from '@features/devices/components/DeviceCard';
import useQueryPage from '@hooks/useQueryPage';
import Layout from '@layout/Layout';
import { Add, SettingsSuggest } from '@mui/icons-material';
import { Box, Button, Container, Grid, Pagination, Toolbar, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

const getDevicesGrid = (devices: Device[]) => (
    <Grid container spacing={5} direction="row" justifyContent="center" alignItems="center">
        {devices.map((device) => (
            <Grid item key={device._id} sx={{ display: 'flex' }}>
                <DeviceCard device={device} />
            </Grid>
        ))}
    </Grid>
);

const NoDevicesYet = () => {
    return (
        <Grid container spacing={0} direction="column" alignItems="center" sx={{ py: 5 }}>
            <Grid item sx={{ fontSize: '96px', height: '120px' }}>
                <SettingsSuggest fontSize="inherit" color="warning" />
            </Grid>
            <Grid item>
                <Typography variant="h5">Add your first device</Typography>
            </Grid>
            <Grid item sx={{ pt: 8 }}>
                <AddDeviceStepper />
            </Grid>
        </Grid>
    );
};

export default function Devices() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { page, setPage } = useQueryPage();

    const { data, isSuccess, isLoading, isPreviousData } = useDevices({
        page,
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return (
            <ErrorDialog
                title={t('generic:errors.failedToLoadData')}
                message={t('generic:errors.noInternetConnection')}
            />
        );
    }

    const onPageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const redirectToDeviceCreator = () => {
        navigate(AppRoute.Devices.Creator);
    };

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        {t('devices:title')}
                    </Typography>
                    <Button size="large" onClick={redirectToDeviceCreator} endIcon={<Add fontSize="inherit" />}>
                        {t('generic:create')}
                    </Button>
                </Toolbar>

                {data._hits.length ? getDevicesGrid(data._hits) : <NoDevicesYet />}

                {data._hits.length ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                        <Pagination
                            count={data._meta.totalPages}
                            size="large"
                            color="primary"
                            onChange={onPageChange}
                            page={page}
                            disabled={isPreviousData}
                        />
                    </Box>
                ) : (
                    <></>
                )}
            </Container>
        </Layout>
    );
}

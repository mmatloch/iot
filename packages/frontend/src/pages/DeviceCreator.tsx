import { useCreateEvent } from '@api/eventsApi';
import { EventDto, EventMetadataType, EventState, EventTriggerType } from '@definitions/entities/eventTypes';
import AddDeviceStepper from '@features/devices/components/AddDeviceStepper';
import EventEditorForm from '@features/events/components/EventEditorForm';
import Layout from '@layout/Layout';
import { SettingsSuggest } from '@mui/icons-material';
import { Button, Container, Grid, Paper, Toolbar, Typography } from '@mui/material';
import { prepareEventDto } from '@utils/modifyEventDto';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

export default function DeviceCreator() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

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

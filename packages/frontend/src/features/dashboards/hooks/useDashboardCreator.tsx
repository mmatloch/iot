import { useCreateDashboard } from '@api/dashboardApi';
import { DashboardDto, DashboardLayout } from '@definitions/entities/dashboardTypes';
import { Widget } from '@definitions/entities/widgetTypes';
import { useSnackbar } from 'notistack';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

export const useDashboardCreator = () => {
    const { t } = useTranslation('dashboards');
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { mutate } = useCreateDashboard();

    const methods = useForm<DashboardDto>({
        defaultValues: {
            displayName: t('creator.defaults.displayName'),
            index: 0,
            layout: [],
        },
    });

    const { handleSubmit } = methods;

    const handleSave = async (dashboardDto: DashboardDto) => {
        mutate(dashboardDto, {
            onSuccess: () => {
                navigate(AppRoute.Dashboards.Root);
            },
            onError: () => {
                enqueueSnackbar(t('errors.failedToCreateDashboard'), {
                    variant: 'error',
                });
            },
        });
    };

    const { append } = useFieldArray({
        control: methods.control,
        name: 'layout',
    });

    const addWidget = (widget: Widget) => {
        const layout: DashboardLayout = {
            widgetId: widget._id,
            widget,
            width: 1,
            height: 1,
            positionX: 0,
            positionY: 0,
        };

        append(layout);
    };

    return {
        handleSave,
        handleSubmit,
        addWidget,
        methods,
    };
};

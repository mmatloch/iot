import { useUpdateDashboard } from '@api/dashboardApi';
import { Dashboard, DashboardDto, DashboardLayout } from '@definitions/entities/dashboardTypes';
import { Widget } from '@definitions/entities/widgetTypes';
import { pick } from 'lodash';
import { useSnackbar } from 'notistack';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

interface Props {
    dashboard: Dashboard;
}

export const useDashboardEditor = ({ dashboard }: Props) => {
    const { t } = useTranslation('dashboards');
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { mutate } = useUpdateDashboard(dashboard);

    const methods = useForm<DashboardDto>({
        defaultValues: pick(dashboard, ['displayName', 'index', 'layout']),
    });

    const { handleSubmit } = methods;

    const handleSave = async (dashboardDto: DashboardDto) => {
        mutate(pick(dashboardDto, ['displayName', 'layout']), {
            onSuccess: () => {
                navigate(AppRoute.Dashboards.Root);
            },
            onError: () => {
                enqueueSnackbar(t('errors.failedToUpdateDashboard'), {
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

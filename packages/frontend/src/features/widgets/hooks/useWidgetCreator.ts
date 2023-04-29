import { useCreateWidget } from '@api/widgetsApi';
import { WidgetDto } from '@definitions/entities/widgetTypes';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

export const useWidgetCreator = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { mutate } = useCreateWidget();

    const methods = useForm<WidgetDto>({
        defaultValues: {
            displayName: t('widgets:creator.defaults.displayName'),
            icon: t('widgets:creator.defaults.icon'),
        },
    });

    const { handleSubmit } = methods;

    const handleSave = async (widgetDto: WidgetDto) => {
        mutate(widgetDto, {
            onSuccess: () => {
                navigate(AppRoute.Widgets.Root);
            },
            onError: () => {
                enqueueSnackbar(t('widgets:errors.failedToCreateWidget'), {
                    variant: 'error',
                });
            },
        });
    };

    return {
        handleSave,
        handleSubmit,
        methods,
    };
};

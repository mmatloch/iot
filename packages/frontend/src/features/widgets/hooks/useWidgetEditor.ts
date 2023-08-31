import { useUpdateWidget } from '@api/widgetsApi';
import { Widget, WidgetDto } from '@definitions/entities/widgetTypes';
import { pick } from 'lodash';
import { useSnackbar } from 'notistack';
import { DefaultValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

interface Props {
    widget: Widget;
}

export const useWidgetEditor = ({ widget }: Props) => {
    const { t } = useTranslation('widgets');
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { mutate } = useUpdateWidget(widget);

    const methods = useForm<WidgetDto>({
        defaultValues: pick(widget, ['displayName', 'icon', 'textLines', 'action']) as DefaultValues<WidgetDto>,
    });

    const { handleSubmit } = methods;

    const handleSave = async (widgetDto: WidgetDto) => {
        mutate(widgetDto, {
            onSuccess: () => {
                navigate(AppRoute.Widgets.Root);
            },
            onError: () => {
                enqueueSnackbar(t('errors.failedToUpdateWidget'), {
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

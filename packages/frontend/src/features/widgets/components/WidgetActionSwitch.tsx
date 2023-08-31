import { useWidgetAction } from '@api/widgetsApi';
import { Widget } from '@definitions/entities/widgetTypes';
import { Switch } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    widget: Widget;
    isDisabled?: boolean;
}

export const WidgetActionSwitch = ({ widget, isDisabled }: Props) => {
    const { t } = useTranslation('widgets');
    const { mutate } = useWidgetAction(widget);
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        mutate(
            {
                type: event.target.checked ? 'off' : 'on',
            },
            {
                onError: () => {
                    enqueueSnackbar(t('errors.failedToTriggerAction'), {
                        variant: 'error',
                    });
                },
            },
        );
    };

    return <Switch checked={widget.actionState} onChange={handleChange} disabled={isDisabled} />;
};

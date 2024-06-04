import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import DeviceAutocompleteWrapper from '@components/devices/DeviceAutocompleteWrapper';
import FormCheckbox from '@components/forms/FormCheckbox';
import { Device } from '@definitions/entities/deviceTypes';
import { useTextLinesForm } from '@features/widgets/hooks/useTextLinesForm';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    lineIndex: number;
}

export const TextLineFromDeviceContext = ({ lineIndex }: Props) => {
    const { t } = useTranslation(['generic', 'widgets']);
    const { update } = useTextLinesForm();
    const { watch } = useWidgetForm();
    const textLines = watch('textLines');

    const useDeviceSensorDataName = `textLines.${lineIndex}.useDeviceSensorData`;

    const handleDeviceSelect = (_e: unknown, device?: Device) => {
        update(lineIndex, {
            id: textLines[lineIndex].id,
            value: textLines[lineIndex].value,
            deviceId: device?._id ?? null,
            useDeviceSensorData: textLines[lineIndex].useDeviceSensorData,
            eventId: null,
            styles: textLines[lineIndex].styles,
        });
    };

    const currentDeviceId = textLines[lineIndex]?.deviceId;

    if (currentDeviceId) {
        return (
            <Stack>
                <DeviceAutocompleteWrapper
                    deviceId={currentDeviceId}
                    onChange={handleDeviceSelect}
                    InputProps={{ label: t('generic:search.selecting.selectDevice') }}
                />
                <FormCheckbox
                    name={useDeviceSensorDataName}
                    label={t('widgets:creator.useDeviceSensorData')}
                    margin="dense"
                />
            </Stack>
        );
    }

    return (
        <Stack>
            <DeviceAutocomplete
                onChange={handleDeviceSelect}
                InputProps={{ label: t('search.selecting.selectDevice') }}
            />

            <FormCheckbox
                name={useDeviceSensorDataName}
                label={t('widgets:creator.useDeviceSensorData')}
                margin="dense"
            />
        </Stack>
    );
};

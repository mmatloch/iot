import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import DeviceAutocompleteWrapper from '@components/devices/DeviceAutocompleteWrapper';
import FormInputText from '@components/forms/FormInputText';
import { Device } from '@definitions/entities/deviceTypes';
import { useTextLinesForm } from '@features/widgets/hooks/useTextLinesForm';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    lineIndex: number;
}

export const TextLineFromDeviceContext = ({ lineIndex }: Props) => {
    const { t } = useTranslation();
    const { update } = useTextLinesForm();
    const { watch } = useWidgetForm();
    const textLines = watch('textLines');

    const handleDeviceSelect = (_e: unknown, device: Device) => {
        update(lineIndex, {
            id: textLines[lineIndex].id,
            value: textLines[lineIndex].value,
            deviceId: device._id,
            eventId: null,
        });
    };

    const currentDeviceId = textLines[lineIndex]?.deviceId;

    return (
        <Stack spacing={1}>
            {currentDeviceId ? (
                <DeviceAutocompleteWrapper
                    deviceId={currentDeviceId}
                    onChange={handleDeviceSelect}
                    InputProps={{ label: t('search.selecting.selectDevice') }}
                />
            ) : (
                <DeviceAutocomplete
                    onChange={handleDeviceSelect}
                    InputProps={{ label: t('search.selecting.selectDevice') }}
                />
            )}

            <FormInputText name={`textLines.${lineIndex}.value`} label={t('value')} />
        </Stack>
    );
};

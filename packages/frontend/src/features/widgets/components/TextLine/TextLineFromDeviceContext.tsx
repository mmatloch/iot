import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import DeviceAutocompleteWrapper from '@components/devices/DeviceAutocompleteWrapper';
import { Device } from '@definitions/entities/deviceTypes';
import { useTextLinesForm } from '@features/widgets/hooks/useTextLinesForm';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
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
            styles: textLines[lineIndex].styles,
        });
    };

    const currentDeviceId = textLines[lineIndex]?.deviceId;

    if (currentDeviceId) {
        return (
            <DeviceAutocompleteWrapper
                deviceId={currentDeviceId}
                onChange={handleDeviceSelect}
                InputProps={{ label: t('search.selecting.selectDevice') }}
            />
        );
    }

    return (
        <DeviceAutocomplete onChange={handleDeviceSelect} InputProps={{ label: t('search.selecting.selectDevice') }} />
    );
};

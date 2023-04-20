import { useDevice } from '@api/devicesApi';
import { TextField } from '@mui/material';

import DeviceAutocomplete, { Props as DeviceAutocompleteProps } from './DeviceAutocomplete';

interface Props extends DeviceAutocompleteProps {
    deviceId: number;
}

export default function DeviceAutocompleteWrapper({ deviceId, ...props }: Props) {
    const { data, isSuccess } = useDevice(deviceId);

    if (isSuccess) {
        return <DeviceAutocomplete defaultValue={data} {...props} />;
    }

    return <TextField />;
}

import { DeviceType } from '@definitions/entities/deviceTypes';
import { DevicesOther, Router, Sensors, SettingsInputAntenna } from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    type: DeviceType;
}

export default function DeviceTypeAvatar({ type }: Props) {
    const { t } = useTranslation();

    const title = t(`devices:type.${type}`);

    switch (type) {
        case DeviceType.Coordinator:
            return (
                <Tooltip title={title}>
                    <Avatar>
                        <SettingsInputAntenna />
                    </Avatar>
                </Tooltip>
            );

        case DeviceType.Router:
            return (
                <Tooltip title={title}>
                    <Avatar>
                        <Router />
                    </Avatar>
                </Tooltip>
            );

        case DeviceType.EndDevice:
            return (
                <Tooltip title={title}>
                    <Avatar>
                        <Sensors />
                    </Avatar>
                </Tooltip>
            );

        case DeviceType.Virtual:
            return (
                <Tooltip title={title}>
                    <Avatar>
                        <DevicesOther />
                    </Avatar>
                </Tooltip>
            );

        default:
            return null;
    }
}

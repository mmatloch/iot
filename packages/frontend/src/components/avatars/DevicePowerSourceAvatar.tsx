import { DevicePowerSource } from '@definitions/entities/deviceTypes';
import { BatteryChargingFull, BatteryUnknown, Power } from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    powerSource: DevicePowerSource;
}

export default function DevicePowerSourceAvatar({ powerSource }: Props) {
    const { t } = useTranslation('devices');

    const title = t(`powerSource.${powerSource}`);

    switch (powerSource) {
        case DevicePowerSource.Battery:
            return (
                <Tooltip title={title}>
                    <Avatar>
                        <BatteryChargingFull />
                    </Avatar>
                </Tooltip>
            );

        case DevicePowerSource.Unknown:
            return (
                <Tooltip title={title}>
                    <Avatar>
                        <BatteryUnknown />
                    </Avatar>
                </Tooltip>
            );

        case DevicePowerSource.Dc:
        case DevicePowerSource.EmergencyMains:
        case DevicePowerSource.MainsSinglePhase:
        case DevicePowerSource.MainsThreePhase:
            return (
                <Tooltip title={title}>
                    <Avatar>
                        <Power />
                    </Avatar>
                </Tooltip>
            );

        default:
            return null;
    }
}

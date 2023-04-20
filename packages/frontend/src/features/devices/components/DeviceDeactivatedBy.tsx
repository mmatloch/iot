import type {
    DeviceDeactivatedBy as IDeviceDeactivatedBy} from '@definitions/entities/deviceTypes';
import {
    DeviceDeactivatedByType
} from '@definitions/entities/deviceTypes';
import { Alert, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

interface Props {
    deactivatedBy: IDeviceDeactivatedBy;
}

export default function DeviceDeactivatedBy({ deactivatedBy }: Props) {
    const { t } = useTranslation();

    if (deactivatedBy.type === DeviceDeactivatedByType.Bridge) {
        return (
            <Alert color="warning">
                <Typography variant="subtitle2">
                    <Trans
                        i18nKey="devices:deactivatedBy.bridge"
                        t={t}
                        values={{ name: deactivatedBy.name }}
                        components={{ strong: <strong /> }}
                    />
                </Typography>
            </Alert>
        );
    }

    return (
        <Alert color="warning">
            <Typography variant="subtitle2">
                <Trans
                    i18nKey="devices:deactivatedBy.user"
                    t={t}
                    values={{ name: deactivatedBy._user.name }}
                    components={{ strong: <strong /> }}
                />
            </Typography>
        </Alert>
    );
}

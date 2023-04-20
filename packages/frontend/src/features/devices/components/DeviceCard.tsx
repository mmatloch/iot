import EntityDates from '@components/EntityDates';
import EntityCardWithBadge from '@components/grid/EntityCardWithBadge';
import type { Device} from '@definitions/entities/deviceTypes';
import { DeviceState } from '@definitions/entities/deviceTypes';
import { MoreVert } from '@mui/icons-material';
import { CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import type { MouseEvent} from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DeviceDeactivatedBy from './DeviceDeactivatedBy';
import DeviceEditDialog from './DeviceEditDialog';
import DeviceMenu from './DeviceMenu';

interface Props {
    entity: Device;
    hideMenu?: boolean;
    raised?: boolean;
}

const getBadgeColor = (state: DeviceState) => {
    switch (state) {
        case DeviceState.Active:
            return 'success';
        case DeviceState.New:
        case DeviceState.Interviewing:
            return 'primary';
        case DeviceState.Inactive:
        case DeviceState.Error:
            return 'error';
        default:
            return 'default';
    }
};

export default function DeviceCard({ entity: device, hideMenu, raised }: Props) {
    const { t } = useTranslation();

    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const stateTransKey = `devices:state.${device.state}` as const;

    const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchorEl(null);
    };

    const openEditDialog = () => {
        closeMenu();
        setEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setEditDialogOpen(false);
    };

    const action = hideMenu ? (
        <></>
    ) : (
        <IconButton onClick={openMenu}>
            <MoreVert />
        </IconButton>
    );

    return (
        <EntityCardWithBadge badgeColor={getBadgeColor(device.state)} badgeContent={t(stateTransKey)} raised={raised}>
            <CardHeader title={device.displayName} titleTypographyProps={{ variant: 'h6' }} action={action} />

            <CardContent>
                <Grid container spacing={3} direction="column">
                    <Grid item>
                        <Typography>{device.description}</Typography>
                    </Grid>

                    <Grid item>
                        {device.deactivatedBy && <DeviceDeactivatedBy deactivatedBy={device.deactivatedBy} />}

                        <EntityDates entity={device} />
                    </Grid>
                </Grid>
            </CardContent>

            <DeviceMenu device={device} onClose={closeMenu} anchorEl={menuAnchorEl} onEdit={openEditDialog} />
            <DeviceEditDialog device={device} isOpen={isEditDialogOpen} onClose={closeEditDialog} />
        </EntityCardWithBadge>
    );
}

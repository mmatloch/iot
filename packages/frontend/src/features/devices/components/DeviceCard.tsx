import { Device, DeviceState } from '@definitions/entities/deviceTypes';
import { MoreVert } from '@mui/icons-material';
import { Badge, Card, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DeviceEditDialog from './DeviceEditDialog';
import DeviceMenu from './DeviceMenu';

interface Props {
    device: Device;
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
        case DeviceState.Unconfigured:
            return 'warning';
        default:
            return 'default';
    }
};

export default function DeviceCard({ device, hideMenu, raised }: Props) {
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
        <Badge color={getBadgeColor(device.state)} badgeContent={t(stateTransKey)}>
            <Card
                sx={{
                    p: 2,
                    width: {
                        xs: 280,
                        sm: 420,
                        md: 450,
                    },
                }}
                raised={raised}
            >
                <CardHeader title={device.displayName} titleTypographyProps={{ variant: 'h6' }} action={action} />
                <CardContent>
                    <Grid container spacing={3} columnSpacing={10}>
                        <Grid item>
                            <Typography>{device.description}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>

                <DeviceMenu device={device} onClose={closeMenu} anchorEl={menuAnchorEl} onEdit={openEditDialog} />

                <DeviceEditDialog device={device} isOpen={isEditDialogOpen} onClose={closeEditDialog} />
            </Card>
        </Badge>
    );
}

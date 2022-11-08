import { Device, DeviceState } from '@definitions/entities/deviceTypes';
import { MoreVert } from '@mui/icons-material';
import { Badge, Card, CardContent, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    device: Device;
    hideMenu?: boolean;
    raised?: boolean;
}

const getBadgeColor = (state: DeviceState) => {
    switch (state) {
        case DeviceState.Active:
            return 'success';
        case DeviceState.Inactive:
            return 'error';
        case DeviceState.Unconfigured:
            return 'warning';
        default:
            return 'default';
    }
};

export default function DeviceCard({ device, hideMenu, raised }: Props) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMediumMedia = useMediaQuery(theme.breakpoints.up('sm'));

    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const stateTransKey = `devices:state.${device.state}` as const;

    const openEditDialog = () => {
        setEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setEditDialogOpen(false);
    };

    return (
        <Badge color={getBadgeColor(device.state)} badgeContent={t(stateTransKey)}>
            <Card
                sx={{
                    p: 2,
                    width: {
                        sm: 420,
                        md: 450,
                    },
                }}
                raised={raised}
            >
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item></Grid>
                        <Grid
                            item
                            sx={{
                                width: {
                                    xs: 90,
                                    sm: 200,
                                    md: 250,
                                },
                            }}
                        >
                            <Typography variant="h6">{device.displayName}</Typography>
                        </Grid>

                        {hideMenu ? (
                            <></>
                        ) : (
                            <Grid item>
                                <IconButton>
                                    <MoreVert />
                                </IconButton>

                                {/* <DeviceEditDialog device={device} isOpen={isEditDialogOpen} onClose={closeEditDialog} /> */}
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Badge>
    );
}

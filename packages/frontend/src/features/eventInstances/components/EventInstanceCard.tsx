import EntityDates from '@components/EntityDates';
import EntityCardWithBadge from '@components/grid/EntityCardWithBadge';
import type { EventInstance } from '@definitions/entities/eventInstanceTypes';
import { EventInstanceState } from '@definitions/entities/eventInstanceTypes';
import { MoreVert } from '@mui/icons-material';
import { CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    entity: EventInstance;
}

const getBadgeColor = (state: EventInstanceState) => {
    switch (state) {
        case EventInstanceState.Success:
            return 'success';
        case EventInstanceState.FailedOnAction:
        case EventInstanceState.FailedOnCondition:
        case EventInstanceState.UnknownError:
            return 'error';
        case EventInstanceState.ConditionNotMet:
            return 'warning';
        default:
            return 'default';
    }
};

export default function EventInstanceCard({ entity: eventInstance }: Props) {
    const { t, i18n } = useTranslation();
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const stateTransKey = `eventInstances:state.${eventInstance.state}` as const;

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

    return (
        <EntityCardWithBadge badgeColor={getBadgeColor(eventInstance.state)} badgeContent={t(stateTransKey)}>
            <CardHeader
                title={eventInstance.event.displayName}
                titleTypographyProps={{ variant: 'body1' }}
                action={
                    <IconButton onClick={openMenu}>
                        <MoreVert />
                    </IconButton>
                }
                sx={{ py: 0 }}
            />
            <CardContent
                sx={{
                    pt: 0,
                    '&:last-child': {
                        pb: 0,
                    },
                }}
            >
                <Grid container spacing={3}>
                    <Grid item>
                        <EntityDates entity={eventInstance} hideCreator />
                    </Grid>
                </Grid>
            </CardContent>

            {/* <EventMenu event={event} onClose={closeEventMenu} anchorEl={eventMenuAnchorEl} onEdit={openEditDialog} />
            <EventEditDialog event={event} isOpen={isEditDialogOpen} onClose={closeEditDialog} /> */}
        </EntityCardWithBadge>
    );
}
import EntityDates from '@components/EntityDates';
import EntityCardWithBadge from '@components/grid/EntityCardWithBadge';
import { EventInstance, EventInstanceState } from '@definitions/entities/eventInstanceTypes';
import { MoreVert } from '@mui/icons-material';
import { CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
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
                title={eventInstance.eventId}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                    <IconButton onClick={openMenu}>
                        <MoreVert />
                    </IconButton>
                }
            />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item>
                        <EntityDates entity={eventInstance} />
                    </Grid>
                </Grid>
            </CardContent>

            {/* <EventMenu event={event} onClose={closeEventMenu} anchorEl={eventMenuAnchorEl} onEdit={openEditDialog} />
            <EventEditDialog event={event} isOpen={isEditDialogOpen} onClose={closeEditDialog} /> */}
        </EntityCardWithBadge>
    );
}

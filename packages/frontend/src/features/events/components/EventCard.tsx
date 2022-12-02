import EntityDates from '@components/EntityDates';
import EntityCardWithBadge from '@components/grid/EntityCardWithBadge';
import type { Event } from '@definitions/entities/eventTypes';
import { MoreVert } from '@mui/icons-material';
import { CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { getEventStateBadgeColor } from '@utils/badgeColor';
import type { MouseEvent} from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import EventEditDialog from './EventEditDialog';
import EventMenu from './EventMenu';

interface Props {
    entity: Event;
}

export default function EventCard({ entity: event }: Props) {
    const { t, i18n } = useTranslation();
    const [eventMenuAnchorEl, setEventMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const stateTransKey = `events:state.${event.state}` as const;
    const triggerTypeTransKey = `events:triggerType.${event.triggerType}` as const;

    const openEventMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setEventMenuAnchorEl(event.currentTarget);
    };

    const closeEventMenu = () => {
        setEventMenuAnchorEl(null);
    };

    const openEditDialog = () => {
        closeEventMenu();
        setEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setEditDialogOpen(false);
    };

    return (
        <EntityCardWithBadge badgeColor={getEventStateBadgeColor(event.state)} badgeContent={t(stateTransKey)}>
            <CardHeader
                title={event.displayName}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                    <IconButton onClick={openEventMenu}>
                        <MoreVert />
                    </IconButton>
                }
            />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item>
                        <Typography>
                            {t('events:entity.triggerType')}: {i18n.format(t(triggerTypeTransKey), 'lowerCase')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <EntityDates entity={event} />
                    </Grid>
                </Grid>
            </CardContent>

            <EventMenu event={event} onClose={closeEventMenu} anchorEl={eventMenuAnchorEl} onEdit={openEditDialog} />
            <EventEditDialog event={event} isOpen={isEditDialogOpen} onClose={closeEditDialog} />
        </EntityCardWithBadge>
    );
}

import { Event } from '@definitions/entities/eventTypes';
import { MoreVert } from '@mui/icons-material';
import { Badge, Card, CardContent, CardHeader, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { getEventStateBadgeColor } from '@utils/badgeColor';
import { formatDistance, formatISO9075 } from 'date-fns';
import { MouseEvent, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import EventEditDialog from './EventEditDialog';
import EventMenu from './EventMenu';

interface Props {
    event: Event;
}

const formatRelativeDate = (date: string) => formatDistance(new Date(date), new Date(), { addSuffix: true });
const formatFullDate = (date: string) =>
    formatISO9075(new Date(date), {
        representation: 'complete',
    });

export default function EventCard({ event }: Props) {
    const { t, i18n } = useTranslation();
    const [eventMenuAnchorEl, setEventMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const stateTransKey = `events:state.${event.state}` as const;
    const triggerTypeTransKey = `events:triggerType.${event.triggerType}` as const;

    const showUpdatedAt = event._createdAt !== event._updatedAt;
    const createdBy = event._createdByUser?.name || event._createdBy || 'SYSTEM';
    const updatedBy = event._updatedByUser?.name || event._updatedBy || 'SYSTEM';

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
        <Badge color={getEventStateBadgeColor(event.state)} badgeContent={t(stateTransKey)}>
            <Card
                sx={{
                    p: 2,
                    width: {
                        xs: 280,
                        sm: 420,
                        md: 450,
                    },
                }}
            >
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
                    <Grid container spacing={3} columnSpacing={10}>
                        <Grid item>
                            <Typography>
                                {t('events:entity.triggerType')}: {i18n.format(t(triggerTypeTransKey), 'lowerCase')}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {showUpdatedAt && (
                                <Tooltip describeChild title={formatFullDate(event._updatedAt)}>
                                    <Typography variant="subtitle2">
                                        <Trans
                                            i18nKey="events:dates.updatedAt"
                                            t={t}
                                            values={{ when: formatRelativeDate(event._updatedAt), by: updatedBy }}
                                            components={{ strong: <strong /> }}
                                        />
                                    </Typography>
                                </Tooltip>
                            )}

                            <Tooltip describeChild title={formatFullDate(event._createdAt)}>
                                <Typography variant="subtitle2">
                                    <Trans
                                        i18nKey="events:dates.createdAt"
                                        t={t}
                                        values={{ when: formatRelativeDate(event._createdAt), by: createdBy }}
                                        components={{ strong: <strong /> }}
                                    />
                                </Typography>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>

                <EventMenu
                    event={event}
                    onClose={closeEventMenu}
                    anchorEl={eventMenuAnchorEl}
                    onEdit={openEditDialog}
                />

                <EventEditDialog event={event} isOpen={isEditDialogOpen} onClose={closeEditDialog} />
            </Card>
        </Badge>
    );
}

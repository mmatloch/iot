import { Event, EventState } from '@definitions/eventTypes';
import { MoreVert } from '@mui/icons-material';
import {
    Badge,
    BadgeProps,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { formatDistance, formatISO9075, intlFormat } from 'date-fns';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EventMenu from './EventMenu';

interface Props {
    event: Event;
}

const getBadgeColor = (state: EventState) => {
    switch (state) {
        case EventState.Active:
            return 'success';
        case EventState.Inactive:
            return 'error';
        case EventState.Completed:
            return 'warning';
        default:
            return 'default';
    }
};

const formatRelativeDate = (date: string) => formatDistance(new Date(date), new Date(), { addSuffix: true });
const formatFullDate = (date: string) =>
    formatISO9075(new Date(date), {
        representation: 'complete',
    });

export default function EventCard({ event }: Props) {
    const { t } = useTranslation();
    const [eventMenuAnchorEl, setEventMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const stateTransKey = `events:state.${event.state}` as const;

    const hideUpdatedAt = event._createdAt === event._updatedAt;

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
        <Badge color={getBadgeColor(event.state)} badgeContent={t(stateTransKey)}>
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
                            <Typography>Trigger type: {event.triggerType}</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip describeChild title={formatFullDate(event._createdAt)}>
                                <Typography>
                                    Created {formatRelativeDate(event._createdAt)} by{' '}
                                    {event._createdByUser?.name || 'SYSTEM'}
                                </Typography>
                            </Tooltip>

                            {hideUpdatedAt ? (
                                <></>
                            ) : (
                                <Tooltip describeChild title={formatFullDate(event._updatedAt)}>
                                    <Typography>
                                        Updated {formatRelativeDate(event._updatedAt)} by{' '}
                                        {event._updatedByUser?.name || 'SYSTEM'}
                                    </Typography>
                                </Tooltip>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>

                <EventMenu
                    event={event}
                    onClose={closeEventMenu}
                    anchorEl={eventMenuAnchorEl}
                    onEdit={openEditDialog}
                />
            </Card>
        </Badge>
    );
}

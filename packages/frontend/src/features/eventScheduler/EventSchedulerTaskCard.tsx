import EntityDates from '@components/EntityDates';
import EntityCardWithBadge from '@components/grid/EntityCardWithBadge';
import { EventSchedulerTask, EventSchedulerTaskState } from '@definitions/entities/eventSchedulerTypes';
import { MoreVert } from '@mui/icons-material';
import { Alert, AlertTitle, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { formatFullDate, formatRelativeDate } from '@utils/dateFormatters';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EventMenu from './EventMenu';

interface Props {
    entity: EventSchedulerTask;
}

const getBadgeColor = (state: EventSchedulerTaskState) => {
    switch (state) {
        case EventSchedulerTaskState.Queued:
            return 'primary';

        case EventSchedulerTaskState.Running:
            return 'success';
    }
};

export default function EventSchedulerTaskCard({ entity: task }: Props) {
    const { t, i18n } = useTranslation();
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const stateTransKey = `eventScheduler:state.${task.state}` as const;

    const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchorEl(null);
    };
    return (
        <EntityCardWithBadge badgeColor={getBadgeColor(task.state)} badgeContent={t(stateTransKey)}>
            <CardHeader
                title={task.event.displayName}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                    <IconButton onClick={openMenu}>
                        <MoreVert />
                    </IconButton>
                }
            />
            <CardContent>
                <Alert color="info" sx={{ mt: 1 }}>
                    <AlertTitle>{t('eventScheduler:nextTrigger')}</AlertTitle>
                    <Typography>{formatRelativeDate(task.nextRunAt)}</Typography>
                    <Typography>{formatFullDate(task.nextRunAt)}</Typography>
                </Alert>
            </CardContent>

            {/* <EventMenu event={event} onClose={closeMenu} anchorEl={eventMenuAnchorEl} onEdit={openEditDialog} /> */}
        </EntityCardWithBadge>
    );
}

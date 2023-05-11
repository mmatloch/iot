import EntityCardWithBadge from '@components/grid/EntityCardWithBadge';
import type { EventSchedulerTask } from '@definitions/entities/eventSchedulerTypes';
import { EventSchedulerTaskState } from '@definitions/entities/eventSchedulerTypes';
import { MoreVert } from '@mui/icons-material';
import { Alert, AlertTitle, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import { formatFullDate, formatRelativeDate } from '@utils/dateFormatters';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import EventSchedulerTaskMenu from './EventSchedulerTaskMenu';

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
    const { t } = useTranslation('eventScheduler');
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const stateTransKey = `state.${task.state}` as const;

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
                    <AlertTitle>{t('nextTrigger')}</AlertTitle>
                    <Typography>{formatRelativeDate(task.nextRunAt)}</Typography>
                    <Typography>{formatFullDate(task.nextRunAt)}</Typography>
                </Alert>
            </CardContent>

            <EventSchedulerTaskMenu eventSchedulerTask={task} onClose={closeMenu} anchorEl={menuAnchorEl} />
        </EntityCardWithBadge>
    );
}

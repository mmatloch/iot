import EntityDates from '@components/EntityDates';
import EntityCardWithBadge from '@components/grid/EntityCardWithBadge';
import type { EventInstance } from '@definitions/entities/eventInstanceTypes';
import { EventInstanceState } from '@definitions/entities/eventInstanceTypes';
import EventRunPerformanceMetricsBar from '@features/events/components/EventTrigger/EventRunPerformanceMetricsBar';
import { MoreVert } from '@mui/icons-material';
import { CardContent, CardHeader, Grid, IconButton } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import EventInstanceMenu from './EventInstanceMenu';

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
    const { t } = useTranslation();
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const stateTransKey = `eventInstances:state.${eventInstance.state}` as const;

    const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchorEl(null);
    };

    return (
        <EntityCardWithBadge badgeColor={getBadgeColor(eventInstance.state)} badgeContent={t(stateTransKey)}>
            <CardHeader
                title={eventInstance.event.displayName}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                    <IconButton onClick={openMenu}>
                        <MoreVert />
                    </IconButton>
                }
            />
            <CardContent>
                <Grid container spacing={1} alignItems="stretch">
                    <Grid item sx={{ width: '100%' }}>
                        <EventRunPerformanceMetricsBar performanceMetrics={eventInstance.performanceMetrics} />
                    </Grid>

                    <Grid item>
                        <EntityDates entity={eventInstance} hideCreator />
                    </Grid>
                </Grid>
            </CardContent>

            <EventInstanceMenu eventInstance={eventInstance} onClose={closeMenu} anchorEl={menuAnchorEl} />
        </EntityCardWithBadge>
    );
}

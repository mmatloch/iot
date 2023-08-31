import { useUpdateEvent } from '@api/eventsApi';
import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import type { Event } from '@definitions/entities/eventTypes';
import { EventState } from '@definitions/entities/eventTypes';
import { Edit, Preview, PublishedWithChanges } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Link, generatePath } from 'react-router-dom';

import { AppRoute } from '../../../constants';

interface Props {
    event: Event;
    onClose: () => void;
    onEdit: () => void;
    anchorEl: HTMLElement | null;
}

export default function EventMenu({ event, onClose, onEdit, anchorEl }: Props) {
    const { t } = useTranslation(['generic', 'events']);
    const { enqueueSnackbar } = useSnackbar();
    const { mutateAsync } = useUpdateEvent(event);

    const eventEditorLink = generatePath(AppRoute.Events.Editor, { eventId: String(event._id) });

    const isMenuOpen = Boolean(anchorEl);

    const isEventActive = event.state === EventState.Active;
    const isUserCreated = event._createdBy !== null;

    const changeState = async () => {
        const newState = isEventActive ? EventState.Inactive : EventState.Active;

        try {
            await mutateAsync({
                state: newState,
            });
        } catch {
            enqueueSnackbar(t('events:errors.failedToUpdateEvent'), {
                variant: 'error',
            });
        }

        onClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem component={Link} to={eventEditorLink}>
                <ListItemButtonWithIcon text={t('events:editor.openInEditor')} icon={<Preview />} />
            </MenuItem>
            <MenuItem onClick={onEdit}>
                <ListItemButtonWithIcon text={t('generic:edit')} icon={<Edit />} />
            </MenuItem>
            {isUserCreated && (
                <MenuItem onClick={changeState}>
                    {isEventActive ? (
                        <ListItemButtonWithIcon text={t(`generic:deactivate`)} icon={<PublishedWithChanges />} />
                    ) : (
                        <ListItemButtonWithIcon text={t(`generic:activate`)} icon={<PublishedWithChanges />} />
                    )}
                </MenuItem>
            )}
        </Menu>
    );
}

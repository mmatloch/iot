import { useUpdateEvent } from '@api/eventsApi';
import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import { Event, EventState } from '@definitions/entities/eventTypes';
import { Edit, Preview, PublishedWithChanges } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

interface Props {
    event: Event;
    onClose: () => void;
    onEdit: () => void;
    anchorEl: HTMLElement | null;
}

export default function EventMenu({ event, onClose, onEdit, anchorEl }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { mutateAsync } = useUpdateEvent(event);
    const navigate = useNavigate();

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

    const openEventEditor = () => {
        navigate(generatePath(AppRoute.Events.Editor, { eventId: String(event._id) }));
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={openEventEditor}>
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

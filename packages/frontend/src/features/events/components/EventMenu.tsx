import { useUpdateEvent } from '@api/eventsApi';
import { Event, EventState } from '@definitions/eventTypes';
import { Edit, PublishedWithChanges } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    event: Event;
    onClose: () => void;
    onEdit: () => void;
    anchorEl: HTMLElement | null;
}

interface ListItemButtonProps {
    text: string;
    icon: ReactNode;
}

const ListItemButton = ({ text, icon }: ListItemButtonProps) => {
    return (
        <>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{text}</ListItemText>
        </>
    );
};

export default function EventMenu({ event, onClose, onEdit, anchorEl }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { mutateAsync } = useUpdateEvent(event);

    const isMenuOpen = Boolean(anchorEl);

    const isEventActive = event.state === EventState.Active;
    const isSystemCreated = event._createdBy === null;

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
            <MenuItem onClick={onEdit}>
                <ListItemButton text={t('generic:edit')} icon={<Edit />} />
            </MenuItem>

            <MenuItem onClick={changeState}>
                {isEventActive ? (
                    <ListItemButton text={t(`generic:deactivate`)} icon={<PublishedWithChanges />} />
                ) : (
                    <ListItemButton text={t(`generic:activate`)} icon={<PublishedWithChanges />} />
                )}
            </MenuItem>
        </Menu>
    );
}

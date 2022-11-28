import { useDeleteEventSchedulerTask } from '@api/eventSchedulerApi';
import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import { EventSchedulerTask, EventSchedulerTaskState } from '@definitions/entities/eventSchedulerTypes';
import { CancelScheduleSend, Preview } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

interface Props {
    eventSchedulerTask: EventSchedulerTask;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export default function EventSchedulerTaskMenu({ eventSchedulerTask, onClose, anchorEl }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { mutateAsync } = useDeleteEventSchedulerTask(eventSchedulerTask);

    const isMenuOpen = Boolean(anchorEl);

    const isQueued = eventSchedulerTask.state === EventSchedulerTaskState.Queued;

    const cancelTask = async () => {
        try {
            await mutateAsync();
        } catch {
            enqueueSnackbar(t('eventScheduler:errors.failedToDeleteTask'), {
                variant: 'error',
            });
        }

        onClose();
    };

    const openEventEditor = () => {
        navigate(generatePath(AppRoute.Events.Editor, { eventId: String(eventSchedulerTask.event._id) }));
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={openEventEditor}>
                <ListItemButtonWithIcon text={t('events:editor.openInEditor')} icon={<Preview />} />
            </MenuItem>
            <MenuItem onClick={cancelTask}>
                {isQueued && <ListItemButtonWithIcon text={t(`generic:cancel`)} icon={<CancelScheduleSend />} />}
            </MenuItem>
        </Menu>
    );
}

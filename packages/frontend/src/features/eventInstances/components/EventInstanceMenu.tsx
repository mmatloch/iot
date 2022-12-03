import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import { EventInstance } from '@definitions/entities/eventInstanceTypes';
import { Preview, ViewSidebar } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';
import { useEventInstanceDetails } from '../hooks/useEventInstanceDetails';

interface Props {
    eventInstance: EventInstance;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export default function EventInstanceMenu({ eventInstance, onClose, anchorEl }: Props) {
    const { t } = useTranslation();
    const { openEventInstanceDetails } = useEventInstanceDetails();
    const navigate = useNavigate();

    const isMenuOpen = Boolean(anchorEl);

    const openDetails = () => {
        openEventInstanceDetails(eventInstance._id);
        onClose();
    };

    const openEventEditor = () => {
        navigate(generatePath(AppRoute.Events.Editor, { eventId: String(eventInstance.event._id) }));
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={openDetails}>
                <ListItemButtonWithIcon text={t('generic:showDetails')} icon={<ViewSidebar />} />
            </MenuItem>
            <MenuItem onClick={openEventEditor}>
                <ListItemButtonWithIcon text={t('events:editor.openInEditor')} icon={<Preview />} />
            </MenuItem>
        </Menu>
    );
}

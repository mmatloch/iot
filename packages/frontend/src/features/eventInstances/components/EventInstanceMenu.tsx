import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import { EventInstance } from '@definitions/entities/eventInstanceTypes';
import { Preview, ViewSidebar } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, generatePath } from 'react-router-dom';

import { AppRoute } from '../../../constants';
import { useEventInstanceDetails } from '../hooks/useEventInstanceDetails';

interface Props {
    eventInstance: EventInstance;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export default function EventInstanceMenu({ eventInstance, onClose, anchorEl }: Props) {
    const { t } = useTranslation(['generic', 'events']);
    const { openEventInstanceDetails } = useEventInstanceDetails();

    const eventEditorLink = generatePath(AppRoute.Events.Editor, { eventId: String(eventInstance.event._id) });

    const isMenuOpen = Boolean(anchorEl);

    const openDetails = () => {
        openEventInstanceDetails(eventInstance._id);
        onClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={openDetails}>
                <ListItemButtonWithIcon text={t('generic:showDetails')} icon={<ViewSidebar />} />
            </MenuItem>
            <MenuItem component={Link} to={eventEditorLink}>
                <ListItemButtonWithIcon text={t('events:editor.openInEditor')} icon={<Preview />} />
            </MenuItem>
        </Menu>
    );
}

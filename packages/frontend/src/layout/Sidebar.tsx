import DashboardsIcon from '@assets/icons/app.png';
import DevicesIcon from '@assets/icons/devices.png';
import EventInstancesIcon from '@assets/icons/eventInstances.png';
import EventsIcon from '@assets/icons/events.png';
import EventSchedulerIcon from '@assets/icons/eventScheduler.png';
import HomeIcon from '@assets/icons/home.png';
import UserIcon from '@assets/icons/user.png';
import { useAuth } from '@hooks/useAuth';
import {
    Avatar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from '@mui/material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AppRoute } from '../constants';

const DRAWER_WIDTH = 300;

interface ItemProps {
    icon: string;
    text: string;
    navigateTo: string;
    adminOnly?: boolean;
}

const Item: FC<ItemProps> = ({ icon, text, navigateTo }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton component={Link} to={navigateTo}>
                <ListItemIcon>
                    <Avatar variant="square" src={icon} />
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    );
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
    const auth = useAuth();
    const isAdmin = auth?.isAdmin;

    const { t } = useTranslation();

    const items = [
        {
            icon: HomeIcon,
            text: 'Home',
            navigateTo: AppRoute.Home,
        },
        {
            icon: UserIcon,
            text: t('users:title'),
            navigateTo: AppRoute.Users,
            adminOnly: true,
        },
        {
            icon: DashboardsIcon,
            text: t('dashboards:title'),
            navigateTo: AppRoute.Dashboards.Root,
        },
        {
            icon: DevicesIcon,
            text: t('devices:title'),
            navigateTo: AppRoute.Devices.Root,
        },
        {
            icon: EventsIcon,
            text: t('events:title'),
            navigateTo: AppRoute.Events.Root,
        },
        {
            icon: EventSchedulerIcon,
            text: t('eventScheduler:title'),
            navigateTo: AppRoute.EventScheduler.Root,
        },
        {
            icon: EventInstancesIcon,
            text: t('eventInstances:title'),
            navigateTo: AppRoute.EventInstances.Root,
        },
    ].filter((item) => {
        if (isAdmin) {
            return true;
        }

        return !item.adminOnly;
    });

    return (
        <Drawer
            variant="temporary"
            anchor="left"
            open={isOpen}
            onClose={onClose}
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {items.map((itemProps, index) => (
                        <Item {...itemProps} key={index} />
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

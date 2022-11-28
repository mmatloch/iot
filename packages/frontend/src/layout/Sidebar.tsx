import { useAuth } from '@hooks/useAuth';
import { Event, Home, ManageAccounts, PendingActions, SpeakerPhone } from '@mui/icons-material';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AppRoute } from '../constants';

const DRAWER_WIDTH = 300;

interface ItemProps {
    icon: ReactNode;
    text: string;
    navigateTo: string;
    adminOnly?: boolean;
}

const Item: FC<ItemProps> = ({ icon, text, navigateTo }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton component={Link} to={navigateTo}>
                <ListItemIcon>{icon}</ListItemIcon>
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
            icon: <Home />,
            text: 'Home',
            navigateTo: AppRoute.Home,
        },
        {
            icon: <ManageAccounts />,
            text: t('users:title'),
            navigateTo: AppRoute.Users,
            adminOnly: true,
        },
        {
            icon: <Event />,
            text: t('events:title'),
            navigateTo: AppRoute.Events.Root,
            adminOnly: true,
        },
        {
            icon: <SpeakerPhone />,
            text: t('devices:title'),
            navigateTo: AppRoute.Devices.Root,
        },
        {
            icon: <PendingActions />,
            text: t('eventScheduler:title'),
            navigateTo: AppRoute.EventScheduler.Root,
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

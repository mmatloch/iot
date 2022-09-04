import { useAuth } from '@hooks/useAuth';
import { Home, ManageAccounts } from '@mui/icons-material';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

const DRAWER_WIDTH = 300;

interface ItemProps {
    icon: ReactNode;
    text: string;
    onClick: () => void;
    adminOnly?: boolean;
}

const Item: FC<ItemProps> = ({ icon, text, onClick }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick}>
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
    const navigate = useNavigate();

    const [items, setItems] = useState<ItemProps[]>([]);

    useEffect(() => {
        setItems(
            [
                {
                    icon: <Home />,
                    text: 'Home',
                    onClick: () => navigate(AppRoute.Home),
                },
                {
                    icon: <ManageAccounts />,
                    text: t('users:management.title'),
                    onClick: () => navigate(AppRoute.Users.Management),
                    adminOnly: true,
                },
            ].filter((item) => {
                if (isAdmin) {
                    return true;
                }

                return !item.adminOnly;
            }),
        );
    }, [isAdmin]);

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

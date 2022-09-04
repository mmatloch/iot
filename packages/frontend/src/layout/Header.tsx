import { useUser } from '@api/usersApi';
import ChangeLanguageDialog from '@components/ChangeLanguageDialog';
import UserEditDialog from '@components/UserEditDialog';
import ProfileMenu from '@features/profile/ProfileMenu';
import UserAvatar from '@features/users/components/UserAvatar';
import { Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { MouseEvent, useState } from 'react';

interface Props {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Props) {
    const { data: user } = useUser();
    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [changeLanguageDialogState, setChangeLanguageDialogState] = useState(false);
    const [editProfileState, setEditProfileState] = useState(false);

    const openProfileMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setProfileMenuAnchorEl(event.currentTarget);
    };

    const closeProfileMenu = () => {
        setProfileMenuAnchorEl(null);
    };

    const openChangeLanguageDialog = () => {
        setChangeLanguageDialogState(true);
    };

    const closeChangeLanguageDialog = () => {
        setChangeLanguageDialogState(false);
    };

    const openEditProfileDialog = () => {
        setEditProfileState(true);
    };

    const closeEditProfileDialog = () => {
        setEditProfileState(false);
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={onMenuClick}>
                    <Menu />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton onClick={openProfileMenu}>
                    <UserAvatar user={user} size={32} />
                </IconButton>
                {user ? (
                    <Box>
                        <ProfileMenu
                            anchorEl={profileMenuAnchorEl}
                            onClose={closeProfileMenu}
                            onChangeLanguageClick={openChangeLanguageDialog}
                            onEditProfileClick={openEditProfileDialog}
                        />

                        <UserEditDialog user={user} isOpen={editProfileState} onClose={closeEditProfileDialog} />
                        <ChangeLanguageDialog isOpen={changeLanguageDialogState} onClose={closeChangeLanguageDialog} />
                    </Box>
                ) : (
                    <></>
                )}
            </Toolbar>
        </AppBar>
    );
}

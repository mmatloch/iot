import UserEditDialog from '@components/UserEditDialog';
import { User, UserState } from '@definitions/userTypes';
import { MoreVert } from '@mui/icons-material';
import { Badge, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import UserAvatar from './UserAvatar';
import UserMenu from './UserMenu';

interface Props {
    user: User;
}

const getBadgeColor = (state: UserState) => {
    switch (state) {
        case UserState.Active:
            return 'success';
        case UserState.Inactive:
            return 'error';
        case UserState.PendingApproval:
            return 'warning';
        default:
            return 'default';
    }
};

export default function UserCard({ user }: Props) {
    const { t } = useTranslation();
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const roleTransKey = `users:role.${user.role}` as const;
    const stateTransKey = `users:state.${user.state}` as const;

    const openUserMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const closeUserMenu = () => {
        setUserMenuAnchorEl(null);
    };

    const openEditDialog = () => {
        closeUserMenu();
        setEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setEditDialogOpen(false);
    };

    return (
        <Badge color={getBadgeColor(user.state)} badgeContent={t(stateTransKey)}>
            <Card sx={{ p: 2, width: '450px' }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item>
                            <UserAvatar user={user} />
                        </Grid>
                        <Grid item sx={{ width: '250px' }}>
                            <Typography variant="h6">{user.name}</Typography>
                            <Typography>{t(roleTransKey)}</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={openUserMenu}>
                                <MoreVert />
                            </IconButton>
                            <UserMenu
                                user={user}
                                onClose={closeUserMenu}
                                anchorEl={userMenuAnchorEl}
                                onEdit={openEditDialog}
                            />
                            <UserEditDialog user={user} isOpen={isEditDialogOpen} onClose={closeEditDialog} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Badge>
    );
}

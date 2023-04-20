import EntityDates from '@components/EntityDates';
import EntityCardWithBadge from '@components/grid/EntityCardWithBadge';
import UserEditDialog from '@components/UserEditDialog';
import type { User} from '@definitions/entities/userTypes';
import { UserState } from '@definitions/entities/userTypes';
import { MoreVert } from '@mui/icons-material';
import { Box, CardContent, CardHeader, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { MouseEvent} from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import UserAvatar from './UserAvatar';
import UserMenu from './UserMenu';

interface Props {
    entity: User;
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

export default function UserCard({ entity: user }: Props) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMediumMedia = useMediaQuery(theme.breakpoints.up('sm'));

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
        <EntityCardWithBadge badgeColor={getBadgeColor(user.state)} badgeContent={t(stateTransKey)}>
            <CardHeader
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <UserAvatar user={user} size={isMediumMedia ? 64 : 48} />
                        <Box sx={{ ml: 3 }}>
                            <Typography variant="h6">{user.name}</Typography>
                            <Typography>{t(roleTransKey)}</Typography>
                        </Box>
                    </Box>
                }
                action={
                    <IconButton onClick={openUserMenu}>
                        <MoreVert />
                    </IconButton>
                }
            />

            <CardContent>
                <Grid container spacing={3} direction="column">
                    <Grid item>
                        <EntityDates entity={user} />
                    </Grid>
                </Grid>
            </CardContent>

            <UserMenu user={user} onClose={closeUserMenu} anchorEl={userMenuAnchorEl} onEdit={openEditDialog} />
            <UserEditDialog user={user} isOpen={isEditDialogOpen} onClose={closeEditDialog} />
        </EntityCardWithBadge>
    );
}

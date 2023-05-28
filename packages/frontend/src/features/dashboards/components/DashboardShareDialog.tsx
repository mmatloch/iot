import { useShareDashboard } from '@api/dashboardApi';
import { useUser, useUsers } from '@api/usersApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { Dashboard } from '@definitions/entities/dashboardTypes';
import { User } from '@definitions/entities/userTypes';
import UserAvatar from '@features/users/components/UserAvatar';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    dashboard: Dashboard;
}

export default function DashboardShareDialog({ dashboard, isOpen, onClose }: Props) {
    const { t } = useTranslation(['generic', 'dashboards']);
    const { data, isLoading, isSuccess } = useUsers({ size: 999 });
    const { data: currentUser } = useUser();

    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync } = useShareDashboard(dashboard);

    const users = useMemo(() => data?._hits.filter((user) => user._id !== currentUser?._id), [currentUser, data]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    const isUserSelected = (user: User) => {
        return selectedUsers.includes(user._id);
    };

    const handleUserSelect = (user: User) => () => {
        if (isUserSelected(user)) {
            setSelectedUsers((currentlySelectedUsers) =>
                currentlySelectedUsers.filter((selectedUser) => selectedUser !== user._id),
            );
        } else {
            setSelectedUsers((currentlySelectedUsers) => [...currentlySelectedUsers, user._id]);
        }
    };

    const handleShare = async () => {
        try {
            await mutateAsync({ userIds: selectedUsers });
            enqueueSnackbar(t('dashboards:share.dashboardSharedSuccessfully'), {
                variant: 'success',
            });
            onClose();
        } catch {
            enqueueSnackbar(t('dashboards:errors.failedToShareDashboard'), {
                variant: 'error',
            });

            return;
        }
    };

    return (
        <Dialog onClose={onClose} open={isOpen}>
            <DialogTitle>{t('dashboards:share.title')}</DialogTitle>

            <DialogContent>
                <List dense>
                    {users?.map((user) => {
                        const isSelected = isUserSelected(user);

                        return (
                            <ListItem
                                key={user._id}
                                secondaryAction={<Checkbox edge="end" checked={isSelected} />}
                                disablePadding
                                onClick={handleUserSelect(user)}
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <UserAvatar user={user} size={32} />
                                    </ListItemAvatar>
                                    <ListItemText primary={user.name} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('cancel')}</Button>
                <Button onClick={handleShare}>{t('share')}</Button>
            </DialogActions>
        </Dialog>
    );
}

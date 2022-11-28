import { useUpdateUser } from '@api/usersApi';
import ListItemButton from '@components/ListItemButton';
import { User, UserState } from '@definitions/entities/userTypes';
import { Edit, PublishedWithChanges } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

interface Props {
    user: User;
    onClose: () => void;
    onEdit: () => void;
    anchorEl: HTMLElement | null;
}

export default function UserMenu({ user, onClose, onEdit, anchorEl }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { mutateAsync } = useUpdateUser(user);

    const isMenuOpen = Boolean(anchorEl);

    const isUserActive = user.state === UserState.Active;

    const changeState = async () => {
        const newState = isUserActive ? UserState.Inactive : UserState.Active;

        try {
            await mutateAsync({
                state: newState,
            });
        } catch {
            enqueueSnackbar(t('users:errors.failedToUpdateUser'), {
                variant: 'error',
            });
        }

        onClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={onEdit}>
                <ListItemButton text={t('generic:edit')} icon={<Edit />} />
            </MenuItem>

            <MenuItem onClick={changeState}>
                {isUserActive ? (
                    <ListItemButton text={t(`generic:deactivate`)} icon={<PublishedWithChanges />} />
                ) : (
                    <ListItemButton text={t(`generic:activate`)} icon={<PublishedWithChanges />} />
                )}
            </MenuItem>
        </Menu>
    );
}

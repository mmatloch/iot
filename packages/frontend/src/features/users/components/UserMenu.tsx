import { useUpdateUser } from '@api/usersApi';
import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import type { User } from '@definitions/entities/userTypes';
import { UserState } from '@definitions/entities/userTypes';
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
    const { t } = useTranslation(['generic', 'users']);
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
                <ListItemButtonWithIcon text={t('generic:edit')} icon={<Edit />} />
            </MenuItem>

            <MenuItem onClick={changeState}>
                {isUserActive ? (
                    <ListItemButtonWithIcon text={t(`generic:deactivate`)} icon={<PublishedWithChanges />} />
                ) : (
                    <ListItemButtonWithIcon text={t(`generic:activate`)} icon={<PublishedWithChanges />} />
                )}
            </MenuItem>
        </Menu>
    );
}

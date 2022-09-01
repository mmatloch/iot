import { useUpdateUser } from '@api/usersApi';
import { User, UserState } from '@definitions/userTypes';
import { Edit, PublishedWithChanges } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    user: User;
    onClose: () => void;
    onEdit: () => void;
    anchorEl: HTMLElement | null;
}

interface ListItemButtonProps {
    text: string;
    icon: ReactNode;
}

const ListItemButton = ({ text, icon }: ListItemButtonProps) => {
    return (
        <>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{text}</ListItemText>
        </>
    );
};

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

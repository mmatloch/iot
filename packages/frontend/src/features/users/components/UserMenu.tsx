import { updateUserState } from '@api/usersApi';
import { User, UserState } from '@definitions/userTypes';
import { Edit, PublishedWithChanges } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

enum MenuOption {
    Edit,
}

interface Props {
    user: User;
    onClose: () => void;
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

export default function UserMenu({ user, onClose, anchorEl }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const isOpen = Boolean(anchorEl);

    const isUserActive = user.state === UserState.Active;

    const onEdit = () => {
        onClose();
    };

    const onChangeState = async () => {
        const newState = isUserActive ? UserState.Inactive : UserState.Active;

        try {
            await updateUserState(user, newState);
        } catch {
            enqueueSnackbar('Failed to change user state', {
                variant: 'error',
            });
        }

        onClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
            <MenuItem onClick={() => onEdit()}>
                <ListItemButton text={t('generic:edit')} icon={<Edit />} />
            </MenuItem>

            <MenuItem onClick={() => onChangeState()}>
                {isUserActive ? (
                    <ListItemButton text={t(`generic:deactivate`)} icon={<PublishedWithChanges />} />
                ) : (
                    <ListItemButton text={t(`generic:activate`)} icon={<PublishedWithChanges />} />
                )}
            </MenuItem>
        </Menu>
    );
}

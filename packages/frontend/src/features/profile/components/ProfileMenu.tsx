import { useAuth } from '@hooks/useAuth';
import { Edit, Logout, Translate } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    anchorEl: HTMLElement | null;
    onChangeLanguageClick: () => void;
    onEditProfileClick: () => void;
}

export default function ProfileMenu({ anchorEl, onClose, onChangeLanguageClick, onEditProfileClick }: Props) {
    const { t } = useTranslation(['auth', 'profile', 'i18n']);
    const auth = useAuth();

    const isMenuOpen = Boolean(anchorEl);

    const logout = () => {
        auth?.logout();
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={onEditProfileClick}>
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <ListItemText>{t('profile:editProfile')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={onChangeLanguageClick}>
                <ListItemIcon>
                    <Translate />
                </ListItemIcon>
                <ListItemText>{t('i18n:changeLanguage')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={logout}>
                <ListItemIcon>
                    <Logout />
                </ListItemIcon>
                <ListItemText>{t('auth:logout')}</ListItemText>
            </MenuItem>
        </Menu>
    );
}

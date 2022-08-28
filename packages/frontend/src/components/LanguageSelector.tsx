import { Translate } from '@mui/icons-material/';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, SvgIcon } from '@mui/material';
import { PL, US } from 'country-flag-icons/react/3x2';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AvailableLanguage } from '../i18n';

interface ListItemButtonProps {
    text: string;
    icon: ReactNode;
}

const ListItemButton = ({ text, icon }: ListItemButtonProps) => {
    return (
        <>
            <ListItemIcon>
                <SvgIcon>{icon}</SvgIcon>
            </ListItemIcon>
            <ListItemText>{text}</ListItemText>
        </>
    );
};

export default function LanguageSelector() {
    const { i18n } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);

    const selectLanguage = (lang: AvailableLanguage) => {
        i18n.changeLanguage(lang);

        closeMenu();
    };

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button onClick={openMenu} startIcon={<Translate />} size="large" />
            <Menu anchorEl={anchorEl} open={isOpen} onClose={closeMenu}>
                <MenuItem onClick={() => selectLanguage(AvailableLanguage.English)}>
                    <ListItemButton text="English" icon={<US />} />
                </MenuItem>

                <MenuItem onClick={() => selectLanguage(AvailableLanguage.Polish)}>
                    <ListItemButton text="Polski" icon={<PL />} />
                </MenuItem>
            </Menu>
        </div>
    );
}

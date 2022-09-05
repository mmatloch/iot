import { AvailableLanguage } from '@definitions/localeTypes';
import { Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText, SvgIcon } from '@mui/material';
import { PL, US } from 'country-flag-icons/react/3x2';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

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

interface Props {
    onClose: () => void;
    isOpen: boolean;
}

export default function ChangeLanguageDialog({ isOpen, onClose }: Props) {
    const { i18n, t } = useTranslation();

    const selectLanguage = (lang: AvailableLanguage) => {
        i18n.changeLanguage(lang);

        onClose();
    };

    return (
        <Dialog onClose={onClose} open={isOpen}>
            <DialogTitle>{t('i18n:changeLanguage')}</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem button onClick={() => selectLanguage(AvailableLanguage.English)}>
                    <ListItemButton text="English" icon={<US />} />
                </ListItem>

                <ListItem button onClick={() => selectLanguage(AvailableLanguage.Polish)}>
                    <ListItemButton text="Polski" icon={<PL />} />
                </ListItem>
            </List>
        </Dialog>
    );
}

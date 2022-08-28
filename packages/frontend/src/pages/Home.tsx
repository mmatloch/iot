import LanguageSelector from '@components/LanguageSelector';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Home() {
    const auth = useAuth();
    const { t } = useTranslation();

    const logout = () => {
        auth?.logout();
    };

    return (
        <>
            <h1>Home</h1>
            <Button onClick={logout}>{t('auth:logout')}</Button>
            <LanguageSelector />
        </>
    );
}

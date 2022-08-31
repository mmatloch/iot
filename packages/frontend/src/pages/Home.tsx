import LanguageSelector from '@components/LanguageSelector';
import { useAuth } from '@hooks/useAuth';
import { ManageAccounts } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

export default function Home() {
    const auth = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const logout = () => {
        auth?.logout();
    };

    return (
        <div>
            <h1>Home</h1>
            <Button onClick={logout}>{t('auth:logout')}</Button>
            <Button startIcon={<ManageAccounts />} onClick={() => navigate(AppRoute.Users.Management)}>
                {t('users:management.title')}
            </Button>
            <LanguageSelector />
        </div>
    );
}

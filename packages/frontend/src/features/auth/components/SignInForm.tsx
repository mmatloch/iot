import GoogleIcon from '@mui/icons-material/Google';
import { Button, ButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    googleAuthUrl: string;
}

export default function SignInForm({ googleAuthUrl }: Props) {
    const { t } = useTranslation('auth');

    const redirectToGoogle = () => {
        location.replace(googleAuthUrl);
    };

    return (
        <div>
            <h1>{t('signIn.title')}</h1>

            <ButtonGroup>
                <Button size="large" startIcon={<GoogleIcon />} sx={{ px: 10, py: 2 }} onClick={redirectToGoogle}>
                    Google
                </Button>
            </ButtonGroup>
        </div>
    );
}

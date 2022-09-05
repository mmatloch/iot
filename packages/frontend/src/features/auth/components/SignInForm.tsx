import { SocialLoginResponse, useGetSocialLogin } from '@api/usersApi';
import CircularProgressLoader from '@components/CircularProgressLoader';
import GoogleIcon from '@mui/icons-material/Google';
import { Button, ButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function SignInForm() {
    const { data, isSuccess, isLoading } = useGetSocialLogin();
    const { t } = useTranslation();

    if (isLoading) {
        return <CircularProgressLoader />;
    }

    if (!isSuccess) {
        return <CircularProgressLoader />;
    }

    const redirectTo = (key: keyof SocialLoginResponse) => {
        const { authenticationUrl } = data[key];

        location.replace(authenticationUrl);
    };

    return (
        <div>
            <h1>{t('auth:signIn.title')}</h1>

            <ButtonGroup>
                <Button
                    size="large"
                    startIcon={<GoogleIcon />}
                    sx={{ px: 10, py: 2 }}
                    onClick={() => redirectTo('google')}
                >
                    Google
                </Button>
            </ButtonGroup>
        </div>
    );
}

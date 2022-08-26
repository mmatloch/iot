import { SocialLoginResponse, useGetSocialLogin } from '@api/users';
import CircularProgressLoader from '@components/CircularProgressLoader';
import GoogleIcon from '@mui/icons-material/Google';
import { Button, ButtonGroup } from '@mui/material';

export default function SignInForm() {
    const { data, isSuccess, isLoading } = useGetSocialLogin();

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
            <h1>Sign in with</h1>

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

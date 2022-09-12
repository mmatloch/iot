import { useGetSocialLogin } from '@api/usersApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { Card, CardContent } from '@mui/material';

import SignInForm from './SignInForm';

export default function SignInCard() {
    const { data, isSuccess, isLoading } = useGetSocialLogin();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return (
        <Card sx={{ p: 3 }}>
            <CardContent>
                <SignInForm googleAuthUrl={data.google.authenticationUrl} />
            </CardContent>
        </Card>
    );
}

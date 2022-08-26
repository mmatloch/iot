import { createToken } from '@api/users';
import CircularProgressLoader from '@components/CircularProgressLoader';
import { HttpError } from '@errors/httpError';
import { useAuth } from '@hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppRoute } from '../../../constants';

export default function RedirectGoogle() {
    const { enqueueSnackbar } = useSnackbar();
    const auth = useAuth();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const sendAuthorizationCode = async (authorizationCode: string) => {
        try {
            const {
                body: { token },
            } = await createToken(authorizationCode);

            auth?.login(token);
        } catch (e) {
            if (e instanceof HttpError) {
                enqueueSnackbar(e.message, {
                    variant: 'error',
                });
            }

            navigate(AppRoute.Auth.SignIn);
        }
    };

    useEffect(() => {
        const authorizationCode = searchParams.get('code');
        if (authorizationCode) {
            sendAuthorizationCode(authorizationCode);
        }
    }, []);

    return <CircularProgressLoader />;
}

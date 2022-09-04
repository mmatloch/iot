import { createToken } from '@api/usersApi';
import CircularProgressLoader from '@components/CircularProgressLoader';
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
    const code = searchParams.get('code');

    const sendAuthorizationCode = async (authorizationCode: string) => {
        const {
            body: { token },
        } = await createToken(authorizationCode);

        return token;
    };

    useEffect(() => {
        if (!code) {
            return;
        }

        let ignore = false;

        sendAuthorizationCode(code)
            .then((token) => {
                if (!ignore) {
                    auth?.login(token);
                }
            })
            .catch((e) => {
                if (!ignore && e instanceof Error) {
                    enqueueSnackbar(e.message, {
                        variant: 'error',
                    });

                    navigate(AppRoute.Auth.SignIn);
                }
            });

        return () => {
            ignore = true;
        };
    }, [code]);

    return <CircularProgressLoader />;
}

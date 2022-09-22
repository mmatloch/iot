import { createToken } from '@api/usersApi';
import CircularProgressLoader from '@components/CircularProgressLoader';
import { UserState } from '@definitions/entities/userTypes';
import { HttpError } from '@errors/httpError';
import { ServerErrorCode, getServerErrorCode } from '@errors/serverErrors';
import { useAuth } from '@hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppRoute } from '../../../constants';

export default function RedirectGoogle() {
    const { t } = useTranslation();
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

    const getErrorMessage = (error: Error) => {
        if (error instanceof HttpError) {
            if (
                error.errorCode === getServerErrorCode(ServerErrorCode.CannotCreateTokenForUser) &&
                (error.detail === UserState.PendingApproval || error.detail === UserState.Inactive)
            ) {
                return t('auth:errors.userInactive');
            }
        }

        return error.message;
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
                    const message = getErrorMessage(e);

                    enqueueSnackbar(message, {
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

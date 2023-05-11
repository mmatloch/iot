import { useCreateToken } from '@api/usersApi';
import CircularProgressLoader from '@components/CircularProgressLoader';
import { UserState } from '@definitions/entities/userTypes';
import { HttpError } from '@errors/httpError';
import { ServerErrorCode, getServerErrorCode } from '@errors/serverErrors';
import { useAuth } from '@hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppRoute } from '../../../constants';

export default function RedirectGoogle() {
    const { t } = useTranslation('auth');
    const { enqueueSnackbar } = useSnackbar();
    const auth = useAuth();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const authorizationCode = searchParams.get('code');

    const { mutate: createToken, data: createTokenResponse, error: createTokenError } = useCreateToken();

    const getErrorMessage = useCallback(
        (error: Error) => {
            if (error instanceof HttpError) {
                if (
                    error.errorCode === getServerErrorCode(ServerErrorCode.CannotCreateTokenForUser) &&
                    (error.detail === UserState.PendingApproval || error.detail === UserState.Inactive)
                ) {
                    return t('errors.userInactive');
                }
            }

            return error.message;
        },
        [t],
    );

    useEffect(() => {
        if (createTokenError) {
            if (createTokenError instanceof Error) {
                const message = getErrorMessage(createTokenError);

                enqueueSnackbar(message, {
                    variant: 'error',
                });

                navigate(AppRoute.Auth.SignIn);
            }
        }
    }, [enqueueSnackbar, createTokenError, getErrorMessage, navigate]);

    useEffect(() => {
        if (createTokenResponse) {
            auth?.login(createTokenResponse.token);
        }
    }, [createTokenResponse, auth]);

    useEffect(() => {
        if (!authorizationCode) {
            return;
        }

        createToken({ authorizationCode });
    }, [authorizationCode, createToken]);

    return <CircularProgressLoader variant="normal" />;
}

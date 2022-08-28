const API_PREFIX = '/api';

const addPrefix = (path: string) => `${API_PREFIX}/${path}`;

export const ApiRoute = {
    Users: {
        Token: addPrefix('users/token'),
        SocialLogin: addPrefix('users/socialLogin'),
    },
};

export const AppRoute = {
    Home: '/',
    Auth: {
        SignIn: '/auth/signIn',
        Redirect: {
            Google: '/auth/redirect/google',
        },
    },
};
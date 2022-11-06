const API_PREFIX = '/api';

const addPrefix = (path: string) => `${API_PREFIX}/${path}`;

export const ApiRoute = {
    Users: {
        Root: addPrefix('users'),
        Me: addPrefix('users/me'),
        Token: addPrefix('users/token'),
        SocialLogin: addPrefix('users/socialLogin'),
    },
    Events: {
        Root: addPrefix('events'),
        Trigger: addPrefix('events/trigger'),
    },
    Devices: {
        Root: addPrefix('devices'),
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
    Users: '/users',
    Events: {
        Root: '/events',
        Creator: '/events/create',
        Editor: '/events/:eventId',
    },
};

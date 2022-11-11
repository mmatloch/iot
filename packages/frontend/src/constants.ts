const API_PREFIX = '/api';

const addPrefix = (path: string) => `${API_PREFIX}/${path}`;

export const ApiRoute = {
    Users: {
        Root: addPrefix('users'),
        Me: addPrefix('users/me'),
        Token: addPrefix('users/token'),
        SocialLogin: addPrefix('users/socialLogin'),
    },
    Devices: {
        Root: addPrefix('devices'),
    },
    Configurations: {
        Root: addPrefix('configurations'),
    },
    Events: {
        Root: addPrefix('events'),
        Trigger: addPrefix('events/trigger'),
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
    Devices: {
        Root: '/devices',
        Creator: '/devices/create',
        Editor: '/devices/:deviceId',
    },
    Events: {
        Root: '/events',
        Creator: '/events/create',
        Editor: '/events/:eventId',
    },
};

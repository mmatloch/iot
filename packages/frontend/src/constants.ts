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
    EventScheduler: {
        Tasks: addPrefix('events/scheduler/tasks'),
    },
    EventInstances: {
        Root: addPrefix('events/instances'),
    },
    Dashboards: {
        Root: addPrefix('dashboards'),
    },
    Widgets: {
        Root: addPrefix('widgets'),
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
    },
    Events: {
        Root: '/events',
        Creator: '/events/create',
        Editor: '/events/:eventId',
    },
    EventScheduler: {
        Root: '/events/scheduler',
    },
    EventInstances: {
        Root: '/events/instances',
    },
    Dashboards: {
        Root: '/dashboards',
        Creator: '/dashboards/create',
    },
    Widgets: {
        Root: '/widgets',
        Creator: '/widgets/create',
    },
};

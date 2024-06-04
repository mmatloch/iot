const API_PREFIX = '/api';

const addPrefix = (path: string) => `${API_PREFIX}/${path}`;

export const WEBSOCKET_URL = `wss://${window.location.host}${addPrefix('live')}`;

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
        Reorder: addPrefix('dashboards/reorder'),
    },
    Widgets: {
        Root: addPrefix('widgets'),
        Preview: addPrefix('widgets/preview'),
        Action: addPrefix('widgets/:widgetId/action'),
    },
    Static: {
        Root: addPrefix('static'),
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
        Editor: '/dashboards/:dashboardId',
    },
    Widgets: {
        Root: '/widgets',
        Creator: '/widgets/create',
        Editor: '/widgets/:widgetId',
    },
};

export const ResponsiveGridLayoutCols = {
    lg: 12,
    md: 6,
    sm: 6,
    xs: 6,
    xxs: 3,
};

export const ResponsiveGridLayoutBreakpoints = {
    lg: 1900,
    md: 800,
    sm: 768,
    xs: 480,
    xxs: 0,
};

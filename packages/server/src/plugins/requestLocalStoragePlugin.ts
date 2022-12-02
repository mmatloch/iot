import { AsyncResource } from 'async_hooks';

import type { ApplicationPlugin} from '@common/application';
import { createApplicationPlugin } from '@common/application';

import type { RequestUser} from '../requestLocalStorage';
import { getRequestLocalStorage } from '../requestLocalStorage';

const asyncResourceProp = '__ASYNC_RESOURCE';

const requestLocalStoragePlugin: ApplicationPlugin = async (app) => {
    app.decorateRequest(asyncResourceProp, null);

    app.addHook('onRequest', (request, _reply, done) => {
        const cb = () => {
            const asyncResource = new AsyncResource('fastify-request-context');
            request[asyncResourceProp] = asyncResource;
            asyncResource.runInAsyncScope(done, request.raw);
        };

        const store = {
            user: request.user as RequestUser,
        };

        getRequestLocalStorage().run(store, cb);
    });

    // Related to https://github.com/nodejs/node/issues/34430 and https://github.com/nodejs/node/issues/33723
    app.addHook('preValidation', (request, _reply, done) => {
        const asyncResource = request[asyncResourceProp];

        if (asyncResource instanceof AsyncResource) {
            asyncResource.runInAsyncScope(done, request.raw);
        }
    });
};

export default createApplicationPlugin(requestLocalStoragePlugin, {
    name: 'RequestLocalStorage',
});

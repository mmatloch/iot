import { createApplicationPlugin } from '../applicationPlugin';
import { ApplicationPlugin } from '../types';

const loggerPlugin: ApplicationPlugin = async (app) => {
    app.addHook('onRequest', (request, _reply, done) => {
        request.log.debug({
            msg: 'Incoming request',
            req: request,
        });

        done();
    });

    app.addHook('onError', (request, _reply, error, done) => {
        request.log.error({
            msg: 'Request error',
            err: error,
        });

        done();
    });

    app.addHook('onResponse', (request, reply, done) => {
        request.log.debug({
            msg: 'Request completed',
            res: reply,
        });

        done();
    });
};

export default createApplicationPlugin(loggerPlugin, {
    name: 'Logger',
});

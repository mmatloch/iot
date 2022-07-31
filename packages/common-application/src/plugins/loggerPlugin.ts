import { createApplicationPlugin } from '../applicationPlugin';
import { ApplicationPlugin } from '../types';

export interface LoggerPluginOptions extends Record<string, unknown> {
    logRequests?: boolean;
    logResponses?: boolean;
}

const loggerPlugin: ApplicationPlugin<LoggerPluginOptions> = async (app, opts) => {
    if (opts.logRequests) {
        app.addHook('onRequest', (request, _reply, done) => {
            request.log.debug({
                msg: 'Incoming request',
                req: request,
            });

            done();
        });
    }

    app.addHook('onError', (request, _reply, error, done) => {
        request.log.error({
            msg: 'Request error',
            err: error,
        });

        done();
    });

    if (opts.logResponses) {
        app.addHook('onResponse', (request, reply, done) => {
            request.log.debug({
                msg: 'Request completed',
                res: reply,
            });

            done();
        });
    }
};

export default createApplicationPlugin(loggerPlugin, {
    name: 'Logger',
});

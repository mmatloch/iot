import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createApplicationPlugin } from '../applicationPlugin';
import type { ApplicationPlugin } from '../types';

const statusPlugin: ApplicationPlugin = async (app) => {
    app.get('/_status', async (_request, reply) => {
        return reply.status(StatusCodes.OK).send({
            status: ReasonPhrases.OK,
        });
    });
};

export default createApplicationPlugin(statusPlugin, {
    name: 'Status',
});

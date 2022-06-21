import { fastify } from 'fastify';
import _ from 'lodash';

import type { Application } from './types';

export const createApplicationFromFastify = (): Application => {
    return fastify({
        logger: true,
    }).withTypeProvider();
};

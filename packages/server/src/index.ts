import createFastify from 'fastify';

import { getConfig } from './config';

const fastify = createFastify({
    logger: true,
});

fastify.get('/', async () => {
    return { hello: 'world' };
});

const start = async () => {
    fastify.log.info({
        msg: 'Configuration',
        config: getConfig(),
    });

    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

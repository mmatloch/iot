import { ApplicationPlugin } from '@common/application';

import errorHandlerPlugin from '../plugins/errorHandlerPlugin';

export const createEventsRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'Event' });
};

import { DataSource } from 'typeorm';

import { getConfig } from '../config';
import { Device } from '../entities/deviceEntity';
import { Event } from '../entities/eventEntity';
import { User } from '../entities/userEntity';

const config = getConfig();

export const timescaleDataSource = new DataSource({
    type: 'postgres',
    url: config.databases.timescale.url,
    synchronize: true,
    logging: false,
    entities: [User, Device, Event],
    subscribers: [],
    migrations: [],
});

import { DataSource } from 'typeorm';

import { getConfig } from '../config';
import { Device } from '../entities/deviceEntity';
import { Event } from '../entities/eventEntity';
import { EventInstance } from '../entities/eventInstanceEntity';
import { SensorData } from '../entities/sensorDataEntity';
import { User } from '../entities/userEntity';

const config = getConfig();

export const timescaleDataSource = new DataSource({
    type: 'postgres',
    url: config.databases.timescale.url,
    synchronize: false,
    migrationsRun: false,
    logging: false,
    entities: [User, Device, Event, EventInstance, SensorData],
    subscribers: [],
    migrations: ['./src/migrations/*.ts'],
});

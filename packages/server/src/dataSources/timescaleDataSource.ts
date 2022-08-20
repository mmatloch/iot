import { DataSource } from 'typeorm';

import { getConfig } from '../config';
import { Device } from '../entities/deviceEntity';
import { Event } from '../entities/eventEntity';
import { EventSubscriber } from '../entities/eventEntitySubscriber';
import { EventInstance } from '../entities/eventInstanceEntity';
import { EventInstanceSubscriber } from '../entities/eventInstanceEntitySubscriber';
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
    subscribers: [EventSubscriber, EventInstanceSubscriber],
    migrations: ['./src/migrations/*.ts'],
});

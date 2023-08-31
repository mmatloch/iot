import { DataSource } from 'typeorm';

import { getConfig } from '../config';
import { Configuration } from '../entities/configurationEntity';
import { ConfigurationSubscriber } from '../entities/configurationEntitySubscriber';
import { Dashboard } from '../entities/dashboardEntity';
import { Device } from '../entities/deviceEntity';
import { Event } from '../entities/eventEntity';
import { EventSubscriber } from '../entities/eventEntitySubscriber';
import { EventInstance } from '../entities/eventInstanceEntity';
import { EventInstanceSubscriber } from '../entities/eventInstanceEntitySubscriber';
import { EventSchedulerTask } from '../entities/eventSchedulerTaskEntity';
import { EventSchedulerTaskSubscriber } from '../entities/eventSchedulerTaskEntitySubscriber';
import { SensorData } from '../entities/sensorDataEntity';
import { User } from '../entities/userEntity';
import { Widget } from '../entities/widgetEntity';
import { Initialize1658620422887 } from '../migrations/1658620422887-Initialize';
import { RemoveEventRunner1659274109943 } from '../migrations/1659274109943-RemoveEventRunner';
import { EventScheduler1660911283007 } from '../migrations/1660911283007-EventScheduler';
import { CreatedByUpdatedBy1661175358951 } from '../migrations/1661175358951-CreatedByUpdatedBy';
import { Configurations1661374101903 } from '../migrations/1661374101903-Configurations';
import { UserAvatar1661962398904 } from '../migrations/1661962398904-UserAvatar';
import { ConfigurationPermitJoin1662924371554 } from '../migrations/1662924371554-ConfigurationPermitJoin';
import { EventInstanceForeignKey1670009734264 } from '../migrations/1670009734264-EventInstanceForeignKey';
import { WidgetsAndDashboards1682452308755 } from '../migrations/1682452308755-WidgetsAndDashboards';
import { DeviceFeatures1684274710053 } from '../migrations/1684274710053-DeviceFeatures';
import { WidgetAction1693492083704 } from '../migrations/1693492083704-WidgetAction';

const config = getConfig();

export const timescaleDataSource = new DataSource({
    type: 'postgres',
    url: config.databases.timescale.url,
    synchronize: false,
    migrationsRun: false,
    logging: false,
    entities: [User, Device, Event, EventInstance, SensorData, EventSchedulerTask, Configuration, Widget, Dashboard],
    subscribers: [EventSubscriber, EventInstanceSubscriber, EventSchedulerTaskSubscriber, ConfigurationSubscriber],
    migrations: [
        Initialize1658620422887,
        RemoveEventRunner1659274109943,
        EventScheduler1660911283007,
        CreatedByUpdatedBy1661175358951,
        Configurations1661374101903,
        UserAvatar1661962398904,
        ConfigurationPermitJoin1662924371554,
        EventInstanceForeignKey1670009734264,
        WidgetsAndDashboards1682452308755,
        DeviceFeatures1684274710053,
        WidgetAction1693492083704,
    ],
});

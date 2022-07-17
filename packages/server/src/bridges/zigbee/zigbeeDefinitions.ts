import { Static, Type } from '@sinclair/typebox';
import _ from 'lodash';

import { mergeSchemas } from '../../utils/schemaUtils';

export const ZIGBEE_TOPIC_PREFIX = 'zigbee2mqtt';

export const ZigbeeTopic = {
    BridgeDevices: `${ZIGBEE_TOPIC_PREFIX}/bridge/devices`,
    BridgeInfo: `${ZIGBEE_TOPIC_PREFIX}/bridge/info`,
};

const genericDeviceSchema = Type.Object({
    ieeeAddress: Type.String(),
    supported: Type.Boolean(),
    friendlyName: Type.String(),
    interviewing: Type.Boolean(),
    interviewCompleted: Type.Boolean(),
});

// https://github.com/Koenkk/zigbee-herdsman/blob/ff2622550423db91ef70bc685f718e25aea39ea4/src/zcl/definition/powerSource.ts
export enum ZigbeePowerSource {
    Unknown = 'Unknown',
    MainsSinglePhase = 'Mains (single phase)',
    MainsThreePhase = 'Mains (3 phase)',
    Battery = 'Battery',
    Dc = 'DC Source',
    EmergencyMainsConstPowered = 'Emergency mains constantly powered',
    EmergencyMainsAndTransferSwitch = 'Emergency mains and transfer switch',
}

// https://github.com/Koenkk/zigbee-herdsman/blob/63131d031a4c0aec0afe2175d2943d8cd9ff21b7/src/controller/tstype.ts#L5
export enum ZigbeeDeviceType {
    Router = 'Router',
    EndDevice = 'EndDevice',
    Coordinator = 'Coordinator',
    GreenPower = 'GreenPower',
    Unknown = 'Unknown',
}

const powerSourceSchema = Type.Enum(ZigbeePowerSource);

const definitionSchema = Type.Object({
    model: Type.String(),
    vendor: Type.String(),
    description: Type.String(),
});

const routerSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(ZigbeeDeviceType.Router),

        manufacturer: Type.String(),
        powerSource: powerSourceSchema,
        definition: definitionSchema,
    }),
    genericDeviceSchema,
);

const endDeviceSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(ZigbeeDeviceType.EndDevice),

        manufacturer: Type.String(),
        powerSource: powerSourceSchema,
        definition: definitionSchema,
    }),
    genericDeviceSchema,
);

const coordinatorSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(ZigbeeDeviceType.Coordinator),
    }),
    genericDeviceSchema,
);

const greenPowerSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(ZigbeeDeviceType.GreenPower),

        manufacturer: Type.String(),
        powerSource: powerSourceSchema,
        definition: definitionSchema,
    }),
    genericDeviceSchema,
);

const unknownDeviceSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(ZigbeeDeviceType.Unknown),

        manufacturer: Type.String(),
        powerSource: powerSourceSchema,
        definition: definitionSchema,
    }),
    genericDeviceSchema,
);

const zigbeeDeviceSchema = Type.Union([
    coordinatorSchema,
    routerSchema,
    endDeviceSchema,
    greenPowerSchema,
    unknownDeviceSchema,
]);

export const zigbeeDevicesSchema = Type.Array(zigbeeDeviceSchema);
export type ZigbeeDevice = Static<typeof zigbeeDeviceSchema>;

export const zigbeeInfoSchema = Type.Object({
    coordinator: Type.Object({
        type: Type.String(),
    }),
});

export type ZigbeeInfo = Static<typeof zigbeeInfoSchema>;

export const zigbeeDeviceDataSchema = Type.Record(Type.String(), Type.Unknown());
export type ZigbeeDeviceData = Static<typeof zigbeeDeviceDataSchema>;

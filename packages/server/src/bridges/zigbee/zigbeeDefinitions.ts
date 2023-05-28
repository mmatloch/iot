import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

import { mergeSchemas } from '../../utils/schemaUtils';
import { BridgeRequestType } from '../generic/genericBridgeDefinitions';

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

enum ZigbeeExposesType {
    Binary = 'binary',
    Numeric = 'numeric',
    Enum = 'enum',
    Text = 'text',
    Composite = 'composite',
    List = 'list',

    Switch = 'switch',
    Light = 'light',
    Fan = 'fan',
    Cover = 'cover',
    Lock = 'lock',
    Climate = 'climate',
}

const featureSchema = Type.Object({
    type: Type.Enum(ZigbeeExposesType),
    name: Type.String(),
    property: Type.String(),
    unit: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),

    valueOn: Type.Optional(Type.Unknown()),
    valueOff: Type.Optional(Type.Unknown()),
    valueToggle: Type.Optional(Type.Unknown()),

    valueMax: Type.Optional(Type.Number()),
    valueMin: Type.Optional(Type.Number()),
    valueStep: Type.Optional(Type.Number()),

    values: Type.Optional(Type.Array(Type.Unknown())),
});

const exposesSchema = mergeSchemas(
    featureSchema,
    Type.Object({
        features: Type.Optional(Type.Array(featureSchema)),
    }),
);

const definitionSchema = Type.Object({
    model: Type.String(),
    vendor: Type.String(),
    description: Type.String(),
    exposes: Type.Array(exposesSchema),
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
    permitJoin: Type.Boolean(),
    permitJoinTimeout: Type.Optional(Type.Integer()),
});

export type ZigbeeInfo = Static<typeof zigbeeInfoSchema>;

export const zigbeeDeviceDataSchema = Type.Record(Type.String(), Type.Unknown());
export type ZigbeeDeviceData = Static<typeof zigbeeDeviceDataSchema>;

export const ZIGBEE_BRIDGE_REQUEST_TYPE_MAP = {
    [BridgeRequestType.PermitJoin]: 'permit_join',
};

const permitJoinDataSchema = Type.Object(
    {
        requestType: Type.Literal(BridgeRequestType.PermitJoin),
        value: Type.Boolean(),
        time: Type.Integer(),
    },
    {
        additionalProperties: false,
    },
);

export const requestBridgeDataSchema = Type.Union([permitJoinDataSchema]);

export type ZigbeeDeviceFeature = Static<typeof featureSchema>;

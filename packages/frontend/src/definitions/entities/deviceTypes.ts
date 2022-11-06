import { SearchQuery, SearchResponse } from '@definitions/searchTypes';

import { GenericEntity } from '../commonTypes';

export enum DeviceType {
    Unknown = 'UNKNOWN',
    Coordinator = 'COORDINATOR',
    EndDevice = 'END_DEVICE',
    Router = 'ROUTER',
    Virtual = 'VIRTUAL',
}

export enum DevicePowerSource {
    Unknown = 'UNKNOWN',
    Battery = 'BATTERY',
    MainsSinglePhase = 'MAINS_SINGLE_PHASE',
    MainsThreePhase = 'MAINS_THREE_PHASE',
    EmergencyMains = 'EMERGENCY_MAINS',
    Dc = 'DC',
    Virtual = 'VIRTUAL',
}

export enum DeviceProtocol {
    Zigbee = 'ZIGBEE',
    Virtual = 'VIRTUAL',
}

export enum DeviceState {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
    Unconfigured = 'UNCONFIGURED',
    Interviewing = 'INTERVIEWING',
    Error = 'ERROR',
    New = 'NEW',
}

export enum DeviceDeactivatedByType {
    Bridge = 'BRIDGE',
    User = 'USER',
}

type DeviceDeactivatedBy =
    | {
          type: DeviceDeactivatedByType.Bridge;
          name: string;
      }
    | {
          type: DeviceDeactivatedByType.User;
          id: number;
      };

export interface Device extends GenericEntity {
    displayName: string;
    model: string;
    vendor: string;
    manufacturer: string;
    description: string;
    ieeeAddress: string;
    powerSource: DevicePowerSource;
    type: DeviceType;
    protocol: DeviceProtocol;
    state: DeviceState;
    deactivatedBy: DeviceDeactivatedBy | null;
}

export type DevicesSearchQuery = SearchQuery<Device>;
export type DevicesSearchResponse = SearchResponse<Device>;

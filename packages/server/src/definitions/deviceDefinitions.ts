import type { User } from '../entities/userEntity';

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
}

export enum DeviceState {
    /**
     * The device is configured and running fine
     */
    Active = 'ACTIVE',
    /**
     * The device was turned off by the user or the bridge. No data is received or sent to it
     */
    Inactive = 'INACTIVE',
    /**
     * The device is being interviewed by an external bridge
     */
    Interviewing = 'INTERVIEWING',
    /**
     * An error occurred while adding, interviewing, or configuring the device.
     *
     * Not used at this point.
     */
    Error = 'ERROR',
    /**
     * The newly added device. This state has a device that hasn't been interviewed yet
     */
    New = 'NEW',
}

export enum DeviceDeactivatedByType {
    Bridge = 'BRIDGE',
    User = 'USER',
}

export type DeviceDeactivatedBy =
    | {
          type: DeviceDeactivatedByType.Bridge;
          name: string;
      }
    | {
          type: DeviceDeactivatedByType.User;
          userId: number;
          _user?: User;
      };

export type DeviceFeatureValue = string | number | boolean;

interface DeviceFeatureStateEntry {
    value: DeviceFeatureValue;
    updatedAt: string;
}

export type DeviceFeatureState = Record<string, DeviceFeatureStateEntry>;

export type DeviceData = Record<string, unknown>;

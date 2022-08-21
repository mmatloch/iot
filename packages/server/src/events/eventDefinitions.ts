export enum EventTriggerType {
    /**
     * Events triggered by the HTTP API
     */
    Api = 'API',
    /**
     * Events triggered when the bridge received data from the device
     */
    IncomingDeviceData = 'INCOMING_DEVICE_DATA',
    /**
     * Events triggered when the bridge sent data to the device
     */
    OutgoingDeviceData = 'OUTGOING_DEVICE_DATA',
    /**
     * Events triggered by the scheduler at a specific time or interval
     */
    Scheduler = 'SCHEDULER',
}

export enum EventState {
    Active = 'ACTIVE',
    Completed = 'COMPLETED',
}

export enum EventMetadataType {
    Scheduler = 'SCHEDULER',
}

export enum EventMetadataOnMultipleInstances {
    Replace = 'REPLACE',
    Create = 'CREATE',
    Skip = 'SKIP',
}

export enum EventMetadataTaskType {
    StaticCron = 'STATIC_CRON',
    RelativeCron = 'RELATIVE_CRON',
    StaticInterval = 'STATIC_INTERVAL',
    RelativeInterval = 'RELATIVE_INTERVAL',
}

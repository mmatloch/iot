export enum ApplicationEnv {
    Development = 'DEVELOPMENT',
    Production = 'PRODUCTION',
}

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
}

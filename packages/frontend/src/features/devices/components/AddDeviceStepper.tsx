import { useConfigurations } from '@api/configurationsApi';
import ErrorDialog from '@components/ErrorDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { Device, DeviceProtocol } from '@definitions/entities/deviceTypes';
import { FilterOperator } from '@definitions/searchTypes';
import { Box, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { getConfigurationTypeByProtocol } from '@utils/configurationUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddDeviceStep from './addDeviceSteps/AddDeviceStep';
import AllowToJoinStep from './addDeviceSteps/AllowToJoinStep';
import SelectProtocolStep from './addDeviceSteps/SelectProtocolStep';
import SetupBridgeConfigurationStep from './addDeviceSteps/SetupBridgeConfigurationStep';
import SetupDeviceStep from './addDeviceSteps/SetupDeviceStep';

export enum AvailableStep {
    SelectProtocol,
    BridgeSetup,
    AllowToJoin,
    AddDevice,
    DeviceSetup,
}

const getConfigurationFiltersByProtocol = (protocol?: DeviceProtocol) => {
    if (!protocol || protocol === DeviceProtocol.Virtual) {
        return undefined;
    }

    const data = JSON.stringify({ type: getConfigurationTypeByProtocol(protocol) });

    return {
        data: {
            [FilterOperator.Json]: data,
        },
    };
};

export default function AddDeviceStepper() {
    const { t } = useTranslation();

    const [activeStep, setActiveStep] = useState(AvailableStep.SelectProtocol);
    const [deviceProtocol, setDeviceProtocol] = useState<DeviceProtocol>();
    const [selectedDevice, setSelectedDevice] = useState<Device>();

    const {
        data,
        isRefetching,
        isRefetchError,
        refetch: fetchConfigurations,
    } = useConfigurations(
        {
            filters: getConfigurationFiltersByProtocol(deviceProtocol),
        },
        {
            enabled: false,
        },
    );

    const configuration = data?._hits[0];

    useEffect(() => {
        if (deviceProtocol) {
            fetchConfigurations();
        }
    }, [deviceProtocol, fetchConfigurations]);

    useEffect(() => {
        switch (deviceProtocol) {
            case DeviceProtocol.Zigbee:
                {
                    if (configuration) {
                        setActiveStep(AvailableStep.AllowToJoin);
                    } else {
                        setActiveStep(AvailableStep.BridgeSetup);
                    }
                }
                break;

            case DeviceProtocol.Virtual:
                {
                    setActiveStep(AvailableStep.AddDevice);
                }
                break;
        }
    }, [configuration, data, deviceProtocol]);

    if (isRefetching) {
        return <FullScreenLoader />;
    }

    if (isRefetchError) {
        return (
            <ErrorDialog
                title={t('generic:errors.failedToLoadData')}
                message={t('generic:errors.noInternetConnection')}
            />
        );
    }

    const onProcotolSelect = (protocol: DeviceProtocol) => {
        setDeviceProtocol(protocol);
    };

    const onCreatedConfiguration = () => {
        fetchConfigurations();
    };

    const onAllowedToJoin = () => {
        setActiveStep(AvailableStep.AddDevice);
    };

    const onDeviceSelect = (device: Device) => {
        setActiveStep(AvailableStep.DeviceSetup);
        setSelectedDevice(device);
    };

    return (
        <Box
            sx={{
                width: {
                    sm: 250,
                    md: 350,
                },
            }}
        >
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                    <StepLabel>{t('devices:creator.selectProtocolStep.title')}</StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.SelectProtocol ? (
                            <SelectProtocolStep onSelect={onProcotolSelect} />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>

                <Step>
                    <StepLabel optional={<Typography variant="caption">{t('generic:optional')}</Typography>}>
                        {t('devices:creator.bridgeSetupStep.title')}
                    </StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.BridgeSetup ? (
                            <SetupBridgeConfigurationStep
                                deviceProtocol={deviceProtocol}
                                onCreatedConfiguration={onCreatedConfiguration}
                            />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>

                <Step>
                    <StepLabel optional={<Typography variant="caption">{t('generic:optional')}</Typography>}>
                        {t('devices:creator.allowToJoin.title')}
                    </StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.AllowToJoin && configuration ? (
                            <AllowToJoinStep configuration={configuration} onSuccess={onAllowedToJoin} />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>

                <Step>
                    <StepLabel>{t('devices:creator.addDevice.title')}</StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.AddDevice && deviceProtocol ? (
                            <AddDeviceStep deviceProtocol={deviceProtocol} onDeviceSelect={onDeviceSelect} />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>

                <Step>
                    <StepLabel>{t('devices:creator.deviceSetup.title')}</StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.DeviceSetup && selectedDevice ? (
                            <SetupDeviceStep device={selectedDevice} />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>
            </Stepper>
        </Box>
    );
}

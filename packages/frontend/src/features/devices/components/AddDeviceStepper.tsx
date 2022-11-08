import { useConfigurations } from '@api/configurationsApi';
import CreateConfigurationForm from '@components/configurations/CreateConfigurationForm';
import ErrorDialog from '@components/ErrorDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { ConfigurationType } from '@definitions/entities/configurationTypes';
import { Device, DeviceProtocol } from '@definitions/entities/deviceTypes';
import { FilterOperator } from '@definitions/searchTypes';
import { useAuth } from '@hooks/useAuth';
import { Box, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { getConfigurationTypeByProtocol } from '@utils/configurationUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddDeviceStepContent from './addDeviceSteps/AddDeviceStepContent';
import AllowToJoinStepContent from './addDeviceSteps/AllowToJoinStepContent';
import SelectProtocolStepContent from './addDeviceSteps/SelectProtocolStepContent';
import SetupBridgeConfigurationStepContent from './addDeviceSteps/SetupBridgeConfigurationStepContent';
import DeviceProtocolList from './DeviceProtocolList';

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
                    <StepLabel>Select your device protocol</StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.SelectProtocol ? (
                            <SelectProtocolStepContent onSelect={onProcotolSelect} />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>

                <Step>
                    <StepLabel optional={<Typography variant="caption">Optional</Typography>}>
                        Set the bridge configuration
                    </StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.BridgeSetup ? (
                            <SetupBridgeConfigurationStepContent
                                deviceProtocol={deviceProtocol}
                                onCreatedConfiguration={onCreatedConfiguration}
                            />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>

                <Step>
                    <StepLabel optional={<Typography variant="caption">Optional</Typography>}>
                        Allow devices to join the network
                    </StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.AllowToJoin && configuration ? (
                            <AllowToJoinStepContent configuration={configuration} onSuccess={onAllowedToJoin} />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>

                <Step>
                    <StepLabel>Add device</StepLabel>
                    <StepContent>
                        {activeStep === AvailableStep.AddDevice && deviceProtocol ? (
                            <AddDeviceStepContent deviceProtocol={deviceProtocol} onDeviceSelect={onDeviceSelect} />
                        ) : (
                            <></>
                        )}
                    </StepContent>
                </Step>

                <Step>
                    <StepLabel>Set up the device</StepLabel>
                    <StepContent>
                        <Typography>The protocol defines how to communicate with the device</Typography>
                        <Box sx={{ mt: 2 }}></Box>
                    </StepContent>
                </Step>
            </Stepper>
        </Box>
    );
}

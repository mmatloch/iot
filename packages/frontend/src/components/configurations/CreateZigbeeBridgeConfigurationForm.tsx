import { useCreateConfiguration } from '@api/configurationsApi';
import FormInputText from '@components/forms/FormInputText';
import { ConfigurationDto, ConfigurationState, ConfigurationType } from '@definitions/configurationTypes';
import { LoadingButton } from '@mui/lab';
import { FormGroup, Link } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FormInput {
    topicPrefix: string;
}

const ZIGBEE2MQTT_DOCS =
    'https://www.zigbee2mqtt.io/guide/usage/mqtt_topics_and_messages.html#mqtt-topics-and-messages';
const DEFAULT_ZIGBEE_TOPIC_PREFIX = 'zigbee2mqtt';

interface Props {
    onSubmitSuccess: () => void;
}

export default function CreateZigbeeBridgeConfigurationForm({ onSubmitSuccess }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { mutateAsync, isLoading } = useCreateConfiguration();

    const methods = useForm<FormInput>();
    const { handleSubmit } = methods;

    const onValidForm = async (payload: FormInput) => {
        const dto: ConfigurationDto = {
            data: {
                type: ConfigurationType.ZigbeeBridge,
                allowDevicesToJoin: false,
                ...payload,
            },
            state: ConfigurationState.Active,
        };

        try {
            await mutateAsync(dto);
            onSubmitSuccess();
        } catch {
            enqueueSnackbar(t('configurations:errors.failedToCreateConfiguration'), {
                variant: 'error',
            });
            return;
        }
    };

    return (
        <FormProvider {...methods}>
            <FormGroup sx={{ m: 1 }}>
                <FormInputText
                    name="topicPrefix"
                    label={t('configurations:entity.data.topicPrefix')}
                    validation={{ required: true }}
                    margin="dense"
                    defaultValue={DEFAULT_ZIGBEE_TOPIC_PREFIX}
                    helperText={
                        <Link href={ZIGBEE2MQTT_DOCS} target="_blank">
                            MQTT Topics and Messages
                        </Link>
                    }
                />

                <LoadingButton
                    onClick={handleSubmit(onValidForm)}
                    loading={isLoading}
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    {t('generic:save')}
                </LoadingButton>
            </FormGroup>
        </FormProvider>
    );
}

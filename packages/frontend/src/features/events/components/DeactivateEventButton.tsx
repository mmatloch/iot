import { useUpdateEvent } from '@api/eventsApi';
import type { Event} from '@definitions/entities/eventTypes';
import { EventState } from '@definitions/entities/eventTypes';
import { PublishedWithChanges } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

interface Props {
    event: Event;
}

export default function DeactivateEventButton({ event }: Props) {
    const { mutateAsync, isLoading } = useUpdateEvent(event);
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    const handleClick = async () => {
        try {
            await mutateAsync({
                state: EventState.Inactive,
            });
        } catch {
            enqueueSnackbar(t('events:errors.failedToUpdateEvent'), {
                variant: 'error',
            });
        }
    };

    return (
        <LoadingButton
            loading={isLoading}
            onClick={handleClick}
            variant="contained"
            color="error"
            startIcon={<PublishedWithChanges />}
        >
            {t(`generic:deactivate`)}
        </LoadingButton>
    );
}

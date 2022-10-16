import { useEvents } from '@api/eventsApi';
import FormLiveAutocomplete from '@components/forms/FormLiveAutocomplete';
import { EventDto } from '@definitions/entities/eventTypes';
import { useDebounce } from '@hooks/useDebounce';
import { FormGroup } from '@mui/material';
import { useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function SchedulerRunAfterEventForm({ methods }: Props) {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 200);

    const { data, isLoading } = useEvents({
        filters: {
            displayName: {
                $iLike: `${debouncedSearchValue}%`,
            },
        },
    });

    return (
        <FormProvider {...methods}>
            <FormGroup>
                <FormLiveAutocomplete
                    name="metadata.runAfterEvent"
                    label={t('events:entity.metadata.runAfterEvent')}
                    validation={{ required: true }}
                    margin="dense"
                    loading={isLoading}
                    getOptionLabel={(event) => event.displayName}
                    isOptionEqualToValue={(option, value) => option.displayName === value.displayName}
                    formatOnSelect={(event) => event?._id}
                    onChange={setSearchValue}
                    options={data?._hits || []}
                />
            </FormGroup>
        </FormProvider>
    );
}

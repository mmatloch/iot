import { useEvents } from '@api/eventsApi';
import FormLiveAutocomplete from '@components/forms/FormLiveAutocomplete';
import { useDebounce } from '@hooks/useDebounce';
import { FormGroup } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SchedulerRunAfterEventForm() {
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
    );
}

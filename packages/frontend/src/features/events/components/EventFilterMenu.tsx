import type { CheckboxFilterMapItem } from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterCheckbox from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterMenu from '@components/search/SearchFilterMenu';
import type { EventsSearchQuery } from '@definitions/entities/eventTypes';
import { EventState } from '@definitions/entities/eventTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    anchorEl: HTMLElement | null;

    setSearchQuery: SetSearchQuery<EventsSearchQuery>;
    searchQuery: EventsSearchQuery;
}

export default function EventFilterMenu({ onClose, anchorEl, setSearchQuery, searchQuery }: Props) {
    const { t } = useTranslation(['generic', 'events']);

    const checkboxFilterMap: Record<string, CheckboxFilterMapItem> = {
        showOnlyActive: {
            path: 'filters.state',
            checkValue: EventState.Active,
            uncheckValue: undefined,
            text: t('generic:search.filtering.showOnlyActive'),
        },
        showOnlyUserCreated: {
            path: 'filters._createdBy.$exists',
            checkValue: true,
            uncheckValue: undefined,
            text: t('events:search.showOnlyUserCreated'),
        },
    };

    return (
        <SearchFilterMenu
            anchorEl={anchorEl}
            onClose={onClose}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        >
            <SearchFilterCheckbox
                searchQuery={searchQuery}
                filterMap={checkboxFilterMap.showOnlyActive}
                setSearchQuery={setSearchQuery}
            />
            <SearchFilterCheckbox
                searchQuery={searchQuery}
                filterMap={checkboxFilterMap.showOnlyUserCreated}
                setSearchQuery={setSearchQuery}
            />
        </SearchFilterMenu>
    );
}

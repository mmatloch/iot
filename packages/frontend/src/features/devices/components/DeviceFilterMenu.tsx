import type { CheckboxFilterMapItem } from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterCheckbox from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterMenu from '@components/search/SearchFilterMenu';
import type { DevicesSearchQuery } from '@definitions/entities/deviceTypes';
import { DeviceState } from '@definitions/entities/deviceTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    anchorEl: HTMLElement | null;

    setSearchQuery: SetSearchQuery<DevicesSearchQuery>;
    searchQuery: DevicesSearchQuery;
}

export default function DeviceFilterMenu({ onClose, anchorEl, setSearchQuery, searchQuery }: Props) {
    const { t } = useTranslation();

    const checkboxFilterMap: Record<string, CheckboxFilterMapItem> = {
        showOnlyActive: {
            path: 'filters.state',
            checkValue: DeviceState.Active,
            uncheckValue: undefined,
            text: t('generic:search.filtering.showOnlyActive'),
        },
    };

    return (
        <SearchFilterMenu
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={onClose}
            anchorEl={anchorEl}
        >
            <SearchFilterCheckbox
                searchQuery={searchQuery}
                filterMap={checkboxFilterMap.showOnlyActive}
                setSearchQuery={setSearchQuery}
            />
        </SearchFilterMenu>
    );
}

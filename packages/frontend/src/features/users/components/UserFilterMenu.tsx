import type { UsersSearchQuery } from '@api/usersApi';
import type { CheckboxFilterMapItem } from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterCheckbox from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterMenu from '@components/search/SearchFilterMenu';
import { UserState } from '@definitions/entities/userTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    anchorEl: HTMLElement | null;

    setSearchQuery: SetSearchQuery<UsersSearchQuery>;
    searchQuery: UsersSearchQuery;
}

export default function UserFilterMenu({ onClose, anchorEl, setSearchQuery, searchQuery }: Props) {
    const { t } = useTranslation();

    const checkboxFilterMap: Record<string, CheckboxFilterMapItem> = {
        showOnlyActive: {
            path: 'filters.state',
            checkValue: UserState.Active,
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

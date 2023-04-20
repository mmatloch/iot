import { UsersSearchQuery, useUsers } from '@api/usersApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import SearchPagination from '@components/search/SearchPagination';
import SearchToolbarWithInput from '@components/search/SearchToolbarWithInput';
import UserCard from '@features/users/components/UserCard';
import UserFilterMenu from '@features/users/components/UserFilterMenu';
import { useSearchQuery } from '@hooks/search/useSearchQuery';
import Layout from '@layout/Layout';
import { Box, Container } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SEARCH_FIELD = 'name';

export default function Users() {
    const { t } = useTranslation();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
    const { searchQuery, setSearchQuery } = useSearchQuery<UsersSearchQuery>({});
    const { data, isSuccess, isLoading, isPreviousData } = useUsers(searchQuery);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    const openFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setFilterMenuAnchorEl(event.currentTarget);
    };

    const closeFilterMenu = () => {
        setFilterMenuAnchorEl(null);
    };

    return (
        <Layout>
            <Container>
                <SearchToolbarWithInput
                    title={t('users:title')}
                    searchLabel={t('users:search.inputLabel')}
                    onFiltersClick={openFilterMenu}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    searchField={SEARCH_FIELD}
                />

                <EntityCardGrid entities={data._hits} Item={UserCard} />

                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                    <SearchPagination
                        data={data}
                        disabled={isPreviousData}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </Box>
            </Container>

            <UserFilterMenu
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
        </Layout>
    );
}

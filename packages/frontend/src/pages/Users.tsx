import { UsersSearchQuery, useUsers } from '@api/usersApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import SearchToolbar from '@components/search/SearchToolbar';
import UserCard from '@features/users/components/UserCard';
import UserFilterMenu from '@features/users/components/UserFilterMenu';
import { useDebounce } from '@hooks/useDebounce';
import useQueryPage from '@hooks/useQueryPage';
import Layout from '@layout/Layout';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { mergeQuery } from '@utils/searchQuery';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Users() {
    const { t } = useTranslation();
    const { page, setPage } = useQueryPage();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = useState<UsersSearchQuery>({});
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 200);

    const { data, isSuccess, isLoading, isPreviousData } = useUsers({
        ...searchQuery,
        filters: {
            ...searchQuery.filters,
            name: {
                $iLike: `${debouncedSearchValue}%`,
            },
        },
        page,
    });

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

    const onFilterChange = (updatedQuery: UsersSearchQuery) => {
        setSearchQuery(mergeQuery(searchQuery, updatedQuery));
    };

    const onPageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Layout>
            <Container>
                <SearchToolbar
                    title={t('users:title')}
                    searchLabel={t('users:search.inputLabel')}
                    onSearchChange={setSearchValue}
                    onFiltersClick={openFilterMenu}
                />

                <Grid container spacing={5} direction="row" justifyContent="center" alignItems="center">
                    {data._hits.map((user) => (
                        <Grid item key={user._id} sx={{ display: 'flex' }}>
                            <UserCard user={user} />
                        </Grid>
                    ))}
                </Grid>

                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                    <Pagination
                        count={data._meta.totalPages}
                        size="large"
                        color="primary"
                        onChange={onPageChange}
                        page={page}
                        disabled={isPreviousData}
                    />
                </Box>
            </Container>

            <UserFilterMenu
                searchQuery={searchQuery}
                onFilterChange={onFilterChange}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
        </Layout>
    );
}

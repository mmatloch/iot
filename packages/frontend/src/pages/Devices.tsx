import { useDevices } from '@api/devicesApi';
import ErrorDialog from '@components/ErrorDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import SearchToolbar from '@components/search/SearchToolbar';
import { DevicesSearchQuery } from '@definitions/entities/deviceTypes';
import DeviceCard from '@features/devices/components/DeviceCard';
import DeviceFilterMenu from '@features/devices/components/DeviceFilterMenu';
import { useDebounce } from '@hooks/useDebounce';
import useQueryPage from '@hooks/useQueryPage';
import Layout from '@layout/Layout';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { mergeQuery } from '@utils/searchQuery';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

export default function Devices() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { page, setPage } = useQueryPage();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = useState<DevicesSearchQuery>({});
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 200);

    const { data, isSuccess, isLoading, isPreviousData } = useDevices({
        ...searchQuery,
        filters: {
            ...searchQuery.filters,
            displayName: {
                $iLike: `${debouncedSearchValue}%`,
            },
        },
        page,
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return (
            <ErrorDialog
                title={t('generic:errors.failedToLoadData')}
                message={t('generic:errors.noInternetConnection')}
            />
        );
    }

    const onPageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const openFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setFilterMenuAnchorEl(event.currentTarget);
    };

    const closeFilterMenu = () => {
        setFilterMenuAnchorEl(null);
    };

    const onFilterChange = (updatedQuery: DevicesSearchQuery) => {
        setSearchQuery(mergeQuery(searchQuery, updatedQuery));
    };

    const redirectToCreator = () => {
        navigate(AppRoute.Devices.Creator);
    };

    return (
        <Layout>
            <Container>
                <SearchToolbar
                    title={t('devices:title')}
                    searchLabel={t('devices:search.inputLabel')}
                    onSearchChange={setSearchValue}
                    onCreateClick={redirectToCreator}
                    onFiltersClick={openFilterMenu}
                />

                <Grid container spacing={5} direction="row" justifyContent="center" alignItems="center">
                    {data._hits.map((device) => (
                        <Grid item key={device._id} sx={{ display: 'flex' }}>
                            <DeviceCard device={device} />
                        </Grid>
                    ))}
                </Grid>

                {data._hits.length ? (
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
                ) : (
                    <></>
                )}
            </Container>

            <DeviceFilterMenu
                searchQuery={searchQuery}
                onFilterChange={onFilterChange}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
        </Layout>
    );
}

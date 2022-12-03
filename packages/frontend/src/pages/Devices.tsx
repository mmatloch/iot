import { useDevices } from '@api/devicesApi';
import ErrorDialog from '@components/ErrorDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import SearchPagination from '@components/search/SearchPagination';
import SearchToolbarWithInput from '@components/search/SearchToolbarWithInput';
import type { DevicesSearchQuery } from '@definitions/entities/deviceTypes';
import DeviceCard from '@features/devices/components/DeviceCard';
import DeviceDetailsDrawerWrapper from '@features/devices/components/DeviceDetailsDrawerWrapper';
import DeviceFilterMenu from '@features/devices/components/DeviceFilterMenu';
import { useSearchQuery } from '@hooks/search/useSearchQuery';
import Layout from '@layout/Layout';
import { Box, Container } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

const SEARCH_FIELD = 'displayName';

export default function Devices() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
    const { searchQuery, setSearchQuery } = useSearchQuery<DevicesSearchQuery>({});
    const { data, isSuccess, isLoading, isPreviousData } = useDevices(searchQuery);

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

    const openFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setFilterMenuAnchorEl(event.currentTarget);
    };

    const closeFilterMenu = () => {
        setFilterMenuAnchorEl(null);
    };

    const redirectToCreator = () => {
        navigate(AppRoute.Devices.Creator);
    };

    return (
        <Layout>
            <Container>
                <SearchToolbarWithInput
                    title={t('devices:title')}
                    searchLabel={t('devices:search.inputLabel')}
                    onCreateClick={redirectToCreator}
                    onFiltersClick={openFilterMenu}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    searchField={SEARCH_FIELD}
                />

                <EntityCardGrid entities={data._hits} Item={DeviceCard} />

                {data._hits.length ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                        <SearchPagination
                            data={data}
                            disabled={isPreviousData}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </Box>
                ) : (
                    <></>
                )}
            </Container>

            <DeviceFilterMenu
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
            <DeviceDetailsDrawerWrapper />
        </Layout>
    );
}

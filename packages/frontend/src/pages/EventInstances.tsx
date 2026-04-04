import { useEventInstances } from '@api/eventInstancesApi';
import { ActionToolbar } from '@components/ActionToolbar';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import type { EventInstancesSearchQuery } from '@definitions/entities/eventInstanceTypes';
import EventInstanceCard from '@features/eventInstances/components/EventInstanceCard';
import EventInstanceDetailsDrawerWrapper from '@features/eventInstances/components/EventInstanceDetailsDrawerWrapper';
import EventInstanceFilterMenu from '@features/eventInstances/components/EventInstanceFilterMenu';
import { useEventInstancesSearchQuery } from '@features/eventInstances/hooks/useEventInstancesSearchQuery';
import Layout from '@layout/Layout';
import { Box, Button, Container } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SIZE_MAP = {
    md: 10,
    lg: 18,
};

export default function EventInstances() {
    const { t } = useTranslation(['eventInstances', 'generic']);
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([undefined]);

    const { searchQuery, setSearchQuery: setEventInstancesSearchQuery } = useEventInstancesSearchQuery({
        defaultSizeMap: SIZE_MAP,
    });
    const currentCursor = cursorStack[cursorStack.length - 1];

    const requestQuery: EventInstancesSearchQuery = currentCursor
        ? {
              ...searchQuery,
              cursor: currentCursor,
          }
        : searchQuery;

    const { data, isSuccess, isLoading, isPreviousData } = useEventInstances(requestQuery);

    const setSearchQuery = (updatedQuery: EventInstancesSearchQuery | undefined) => {
        setCursorStack([undefined]);
        setEventInstancesSearchQuery(updatedQuery);
    };

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

    const openNextPage = () => {
        if (!data._meta.nextCursor) {
            return;
        }

        setCursorStack((currentStack) => [...currentStack, data._meta.nextCursor]);
    };

    const openPreviousPage = () => {
        setCursorStack((currentStack) => currentStack.slice(0, -1));
    };

    const hasPreviousPage = cursorStack.length > 1;
    const hasNextPage = !!data._meta.nextCursor;

    return (
        <Layout>
            <Container>
                <ActionToolbar title={t('title')} onFiltersClick={openFilterMenu} />

                <EntityCardGrid entities={data._hits} Item={EventInstanceCard} spacing={3} />

                {data._hits.length ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                        <Box display="flex" gap={2}>
                            <Button
                                size="large"
                                variant="outlined"
                                onClick={openPreviousPage}
                                disabled={!hasPreviousPage || isPreviousData}
                            >
                                {t('generic:search.pagination.previous')}
                            </Button>

                            <Button
                                size="large"
                                variant="contained"
                                onClick={openNextPage}
                                disabled={!hasNextPage || isPreviousData}
                            >
                                {t('generic:search.pagination.next')}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <></>
                )}
            </Container>

            <EventInstanceFilterMenu
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
            <EventInstanceDetailsDrawerWrapper />
        </Layout>
    );
}

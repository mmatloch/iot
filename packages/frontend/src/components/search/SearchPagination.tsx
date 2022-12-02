import type { GenericEntity } from '@definitions/commonTypes';
import type { SearchQuery, SearchResponse } from '@definitions/searchTypes';
import type { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { Pagination } from '@mui/material';

interface Props<TEntity extends GenericEntity> {
    data: SearchResponse<TEntity>;
    disabled: boolean;
    setSearchQuery: SetSearchQuery<TEntity>;
    searchQuery: SearchQuery<TEntity>;
}

export default function SearchPagination<TEntity extends GenericEntity>({
    data,
    disabled,
    setSearchQuery,
    searchQuery,
}: Props<TEntity>) {
    const onChange = (_event: unknown, newPage: number) => {
        setSearchQuery({
            page: newPage,
        });
    };

    return (
        <Pagination
            count={data._meta.totalPages}
            size="large"
            color="primary"
            onChange={onChange}
            page={searchQuery.page}
            disabled={disabled}
        />
    );
}

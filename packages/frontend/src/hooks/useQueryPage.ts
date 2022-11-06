import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_PAGE = 1;

export default function useQueryPage() {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [searchParams, setSearchParams] = useSearchParams();

    const pageFromParams = searchParams.get('page');

    useEffect(() => {
        const parsedPage = Number(pageFromParams);

        if (parsedPage > 1) {
            setPage(parsedPage);
        } else {
            setPage(DEFAULT_PAGE);
        }
    }, [pageFromParams]);

    return {
        page,
        setPage: (newPage: number) => {
            if (newPage > 1) {
                searchParams.set('page', String(newPage));
            } else {
                searchParams.delete('page');
            }

            setSearchParams(searchParams);
        },
    };
}

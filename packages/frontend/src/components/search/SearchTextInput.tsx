import { GenericEntity } from '@definitions/commonTypes';
import { FilterOperator, SearchQuery } from '@definitions/searchTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { useDebounce } from '@hooks/useDebounce';
import { BaseTextFieldProps, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

interface Props<TEntity extends GenericEntity> extends BaseTextFieldProps {
    setSearchQuery: SetSearchQuery<TEntity>;
    searchField: keyof TEntity;
}

export default function SearchTextInput<TEntity extends GenericEntity>({
    setSearchQuery,
    searchField,
    ...inputProps
}: Props<TEntity>) {
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce(inputValue, 200);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        const filters: SearchQuery<TEntity>['filters'] = {};

        if (debouncedInputValue) {
            filters[searchField] = {
                [FilterOperator.ILike]: `${debouncedInputValue}%`,
            };
        } else {
            filters[searchField] = undefined;
        }

        setSearchQuery({
            filters,
        });
    }, [debouncedInputValue, searchField, setSearchQuery]);

    return <TextField {...inputProps} onChange={onChange} value={inputValue} />;
}

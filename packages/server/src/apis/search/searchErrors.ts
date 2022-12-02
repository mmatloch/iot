import { HttpError } from '@common/errors';

enum SearchErrorCode {
    DisallowedField = 1,
    DisallowedSortField,
    DisallowedFiltersField,
    DisallowedRelationsField,
    InvalidFieldValue,
}

export const getSearchErrorCode = (code: SearchErrorCode): string => {
    return `SRCH-${code}`;
};

const getInvalidSearchParamsError = (message: string, searchErrorCode: SearchErrorCode) => {
    return HttpError.unprocessableEntity({
        message: `Invalid search params. ${message}`,
        errorCode: getSearchErrorCode(searchErrorCode),
    });
};

export const SearchError = {
    disallowedField: (field: string): HttpError => {
        return getInvalidSearchParamsError(`Disallowed field '${field}'`, SearchErrorCode.DisallowedField);
    },

    disallowedSortField: (field: string): HttpError => {
        return getInvalidSearchParamsError(`Disallowed sort field '${field}'`, SearchErrorCode.DisallowedSortField);
    },

    disallowedFiltersField: (field: string): HttpError => {
        return getInvalidSearchParamsError(
            `Disallowed filters field '${field}'`,
            SearchErrorCode.DisallowedFiltersField,
        );
    },

    disallowedRelationsField: (field: string): HttpError => {
        return getInvalidSearchParamsError(
            `Disallowed relations field '${field}'`,
            SearchErrorCode.DisallowedRelationsField,
        );
    },

    invalidFieldValue: (field: string): HttpError => {
        return getInvalidSearchParamsError(`Invalid value of field '${field}'`, SearchErrorCode.InvalidFieldValue);
    },
};

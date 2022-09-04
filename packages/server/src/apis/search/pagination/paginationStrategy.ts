import { SearchQuery, SearchResponse } from '../searchDefinitions';
import { RawSearchQuery } from '../searchQuerySchema';

export interface PaginationStrategy {
    doesQueryMatchStrategy: (rawSearchQuery: RawSearchQuery) => boolean;
    buildQuery: (searchQuery: SearchQuery, rawSearchQuery: RawSearchQuery) => void;
    buildResponse: (searchResponse: SearchResponse<unknown>, searchQuery: SearchQuery) => void;
}

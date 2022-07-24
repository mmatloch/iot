import { SearchResponse } from '../apis/searchApi';

export interface GenericService<TEntity, TEntityDto, TEntitySearchQuery = Partial<TEntityDto>> {
    create: (dto: TEntityDto) => Promise<TEntity>;
    search: (query: TEntitySearchQuery) => Promise<SearchResponse<TEntity>>;
    findByIdOrFail: (_id: number) => Promise<TEntity>;
    update: (entity: TEntity, updatedEntity: Partial<TEntity>) => Promise<TEntity>;
}

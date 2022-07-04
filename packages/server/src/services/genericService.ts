import { SearchResponse } from '../apis/searchApi';

export interface GenericService<TEntity, TEntityDto> {
    create: (dto: TEntityDto) => Promise<TEntity>;
    search: (dto: Partial<TEntityDto>) => Promise<SearchResponse<TEntity>>;
    findByIdOrFail: (_id: number) => Promise<TEntity>;
    update: (entity: TEntity, updatedEntity: Partial<TEntity>) => Promise<TEntity>;
}

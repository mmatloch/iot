import type { FindManyOptions } from 'typeorm';

export interface GenericService<TEntity, TEntityDto> {
    create: (dto: TEntityDto) => Promise<TEntity>;
    search: (query: FindManyOptions<TEntity>) => Promise<TEntity[]>;
    searchAndCount: (query: FindManyOptions<TEntity>) => Promise<[TEntity[], number]>;
    findByIdOrFail: (_id: number) => Promise<TEntity>;
    update: (entity: TEntity, updatedEntity: Partial<TEntity>) => Promise<TEntity>;
}

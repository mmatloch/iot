export interface GenericEntity {
    _id: number;
    _version: number;
    _createdAt: string;
    _createdBy: number | null;
    _updatedAt: string;
    _updatedBy: number | null;
}

export interface SearchResponse<TEntity extends GenericEntity> {
    _hits: TEntity[];
    _meta: {
        totalHits: number;
    };
}

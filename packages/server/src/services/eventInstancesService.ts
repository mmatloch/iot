import { Equal, LessThan } from 'typeorm';
import type { FindManyOptions, FindOptionsWhere } from 'typeorm';

import type { EventInstance, EventInstanceDto } from '../entities/eventInstanceEntity';
import { SearchError } from '../apis/search/searchErrors';
import { createEventInstancesRepository } from '../repositories/eventInstancesRepository';
import type { GenericService } from './genericService';

interface EventInstancesCursor {
    _createdAt: string;
    _id: number;
}

export interface EventInstancesConnectionResponse {
    _hits: EventInstance[];
    _meta: {
        nextCursor?: string;
    };
}

export interface EventInstancesService
    extends Pick<
        GenericService<EventInstance, EventInstanceDto>,
        'create' | 'search' | 'searchAndCount' | 'findByIdOrFail'
    > {
    searchConnection: (
        query: FindManyOptions<EventInstance>,
        cursor?: string,
    ) => Promise<EventInstancesConnectionResponse>;
}

export const createEventInstancesService = (): EventInstancesService => {
    const repository = createEventInstancesRepository();

    const parseCursor = (cursor: string): EventInstancesCursor => {
        try {
            const parsedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));

            if (typeof parsedCursor?._createdAt !== 'string' || typeof parsedCursor?._id !== 'number') {
                throw new Error('Invalid cursor');
            }

            return parsedCursor;
        } catch {
            throw SearchError.invalidFieldValue('cursor');
        }
    };

    const encodeCursor = (eventInstance: Pick<EventInstance, '_createdAt' | '_id'>) => {
        return Buffer.from(
            JSON.stringify({
                _createdAt: eventInstance._createdAt,
                _id: eventInstance._id,
            }),
        ).toString('base64');
    };

    const buildCursorWhere = (
        baseWhere: FindOptionsWhere<EventInstance> | undefined,
        cursor: EventInstancesCursor,
    ): FindOptionsWhere<EventInstance>[] => {
        return [
            {
                ...baseWhere,
                _createdAt: LessThan(cursor._createdAt),
            },
            {
                ...baseWhere,
                _createdAt: Equal(cursor._createdAt),
                _id: LessThan(cursor._id),
            },
        ];
    };

    const create: EventInstancesService['create'] = (dto) => {
        const eventInstance = repository.create(dto);

        return repository.saveAndFind(eventInstance);
    };

    const findByIdOrFail: EventInstancesService['findByIdOrFail'] = (_id) => {
        return repository.findOneOrFail({
            where: { _id },
        });
    };

    const search: EventInstancesService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: EventInstancesService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const searchConnection: EventInstancesService['searchConnection'] = async (query, cursor) => {
        const take = query.take ?? 10;
        const baseWhere = query.where as FindOptionsWhere<EventInstance> | undefined;
        const where = cursor ? buildCursorWhere(baseWhere, parseCursor(cursor)) : baseWhere;

        const hits = await repository.find({
            ...query,
            where,
            take: take + 1,
            order: {
                _createdAt: 'DESC',
                _id: 'DESC',
            },
        });

        const pageHits = hits.slice(0, take);
        const nextCursor = hits.length > take && pageHits.length ? encodeCursor(pageHits[pageHits.length - 1]) : undefined;

        return {
            _hits: pageHits,
            _meta: {
                nextCursor,
            },
        };
    };

    return {
        create,
        findByIdOrFail,
        search,
        searchAndCount,
        searchConnection,
    };
};

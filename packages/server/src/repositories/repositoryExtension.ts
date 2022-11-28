import _ from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { GenericEntity } from '../entities/generic/genericEntity';

interface Options {
    loadRelations?: boolean;
}

export const getRepositoryExtension = <T extends GenericEntity>(opts?: Options) => {
    const { loadRelations } = _.defaults(opts, {
        loadRelations: true,
    });

    const relations = loadRelations
        ? {
              _createdByUser: true,
              _updatedByUser: true,
          }
        : undefined;

    return {
        saveAndFind: async function (this: Repository<T>, entity: DeepPartial<T>) {
            console.log(' saveAndFind', entity);
            const savedEntity = await this.save(entity);

            return this.findOneOrFail({
                // @ts-expect-error not working, probably because 'this'
                where: {
                    _id: savedEntity._id,
                },
                // @ts-expect-error not working, probably because 'this'
                relations,
            });
        },
    };
};

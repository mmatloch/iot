import type { GenericEntity } from '@definitions/commonTypes';
import { GENERIC_ENTITY_FIELDS } from '@definitions/commonTypes';
import { entries, get, isEqual, omit, set } from 'lodash';

export const omitGenericEntityFields = <T extends GenericEntity>(entity: T): Omit<T, keyof GenericEntity> => {
    return omit(entity, GENERIC_ENTITY_FIELDS) as Omit<T, keyof GenericEntity>;
};

export const getChangedFields = <T extends object>(orginalObj: T, modifiedObj: T): Partial<T> => {
    const newObj = {};

    entries(orginalObj).forEach(([path, value]) => {
        const modifiedValue = get(modifiedObj, path);

        if (!isEqual(value, modifiedValue)) {
            set(newObj, path, modifiedValue);
        }
    });

    return newObj;
};

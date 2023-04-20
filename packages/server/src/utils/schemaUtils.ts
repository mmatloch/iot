import type { TObject, TProperties } from '@sinclair/typebox';
import _ from 'lodash';

export const mergeSchemas = <TargetProp extends TProperties, SrcProp extends TProperties>(
    target: TObject<TargetProp>,
    source: TObject<SrcProp>,
): TObject<TargetProp & SrcProp> => {
    const properties = {
        ...target.properties,
        ...source.properties,
    };

    const required = [...(target.required || []), ...(source.required || [])];

    return {
        ...target,
        ...source,
        properties,
        required: _.uniq(required),
    };
};

export const removeSchemaDefaults = <T extends TObject<TProperties>>(schema: T): T => {
    Object.values(schema.properties).forEach((prop) => _.unset(prop, 'default'));

    return schema;
};

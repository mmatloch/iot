import { TObject, TProperties } from '@sinclair/typebox';

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
        required,
    };
};

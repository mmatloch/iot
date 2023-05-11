import { has, isString, isUndefined } from 'lodash';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface KeyValuesMessage {
    key: string;
    values: Record<string, unknown>;
}

const isKeyValues = (error: unknown): error is KeyValuesMessage => {
    return has(error, 'key') && has(error, 'values');
};

export const useFormErrorTranslation = (error: FieldError): string | null | undefined => {
    const { t } = useTranslation();

    if (isUndefined(error)) {
        return error;
    }

    const message: unknown = error.message;

    if (isUndefined(message)) {
        return message;
    }

    if (isString(message)) {
        // @ts-expect-error strict type VS string
        return t(message);
    }

    if (isKeyValues(message)) {
        // @ts-expect-error strict type VS string
        return t(message.key, message.values) as string;
    }

    throw Error(`Unknown form error: ${message}`);
};

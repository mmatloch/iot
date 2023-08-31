import { get } from 'lodash';

const VARIABLE_REGEX = /{{(.+?)}}/g;

const IF_CLAUSE_REGEX = /(.+?) \? "(.*?)" : "(.*?)"/;

export const parseWidgetText = (text: string, context: unknown): string => {
    const getter = (path: string) => get(context, path, 'UNKNOWN');

    return text.replace(VARIABLE_REGEX, (_match, variable: string) => {
        const ifClauseMatch = variable.match(IF_CLAUSE_REGEX);
        if (ifClauseMatch) {
            const [, propertyName, truthyValue, falsyValue] = ifClauseMatch;

            const value = getter(propertyName);

            return value ? truthyValue : falsyValue;
        }

        return getter(variable);
    });
};

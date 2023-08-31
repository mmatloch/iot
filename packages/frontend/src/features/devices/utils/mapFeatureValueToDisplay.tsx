import { isBoolean } from 'lodash';
import { Trans } from 'react-i18next';

export const mapFeatureValueToDisplay = (value: string | number | boolean) => {
    if (isBoolean(value)) {
        if (value) {
            return <Trans i18nKey="on" />;
        }

        return <Trans i18nKey="off" />;
    }

    return value;
};

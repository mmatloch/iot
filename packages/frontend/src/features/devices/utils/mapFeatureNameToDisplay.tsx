import { upperFirst } from 'lodash';
import { Trans } from 'react-i18next';

export const mapFeatureNameToDisplay = (value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = `devices:featureNames.${value}` as any;

    return <Trans i18nKey={key} defaults={upperFirst(value)} />;
};

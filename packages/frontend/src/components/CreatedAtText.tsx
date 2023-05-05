import type { GenericEntity } from '@definitions/commonTypes';
import { Tooltip, Typography } from '@mui/material';
import { formatFullDate, formatRelativeDate } from '@utils/dateFormatters';
import { Trans, useTranslation } from 'react-i18next';

interface Props {
    entity: GenericEntity;
    hideCreator?: boolean;
}

export default function CreatedAtText({ entity, hideCreator }: Props) {
    const { t } = useTranslation();

    const createdBy = entity._createdByUser?.name || entity._createdBy || 'SYSTEM';

    return (
        <Tooltip describeChild title={formatFullDate(entity._createdAt)}>
            <Typography variant="subtitle2">
                <Trans
                    i18nKey={hideCreator ? 'dates.createdAt' : 'dates.createdAtAndBy'}
                    t={t}
                    values={{ when: formatRelativeDate(entity._createdAt), by: createdBy }}
                    components={{ strong: <strong /> }}
                />
            </Typography>
        </Tooltip>
    );
}

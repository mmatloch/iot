import type { GenericEntity } from '@definitions/commonTypes';
import { Tooltip, Typography } from '@mui/material';
import { formatFullDate, formatRelativeDate } from '@utils/dateFormatters';
import { Trans, useTranslation } from 'react-i18next';

interface Props {
    entity: GenericEntity;
}

export default function UpdatedAtText({ entity }: Props) {
    const { t } = useTranslation();

    const updatedBy = entity._updatedByUser?.name || entity._updatedBy || 'SYSTEM';

    return (
        <Tooltip describeChild title={formatFullDate(entity._updatedAt)}>
            <Typography variant="subtitle2">
                <Trans
                    i18nKey="generic:dates.updatedAt"
                    t={t}
                    values={{ when: formatRelativeDate(entity._updatedAt), by: updatedBy }}
                    components={{ strong: <strong /> }}
                />
            </Typography>
        </Tooltip>
    );
}

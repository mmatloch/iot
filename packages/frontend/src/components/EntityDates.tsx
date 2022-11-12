import { GenericEntity } from '@definitions/commonTypes';
import { Alert, Box } from '@mui/material';

import CreatedAtText from './CreatedAtText';
import UpdatedAtText from './UpdatedAtText';

interface Props {
    entity: GenericEntity;
}

export default function EntityDates({ entity }: Props) {
    const showUpdatedAt = entity._createdAt !== entity._updatedAt;

    return (
        <Alert color="info" sx={{ mt: 1 }}>
            {showUpdatedAt && (
                <Box sx={{ mb: 1 }}>
                    <UpdatedAtText entity={entity} />
                </Box>
            )}

            <CreatedAtText entity={entity} />
        </Alert>
    );
}

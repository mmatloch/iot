import type { GenericEntity } from '@definitions/commonTypes';
import { Alert, Box } from '@mui/material';

import CreatedAtText from './CreatedAtText';
import UpdatedAtText from './UpdatedAtText';

interface Props {
    entity: GenericEntity;
    hideCreator?: boolean;
}

export default function EntityDates(props: Props) {
    const showUpdatedAt = props.entity._createdAt !== props.entity._updatedAt;

    return (
        <Alert color="info" sx={{ mt: 1 }}>
            {showUpdatedAt && (
                <Box sx={{ mb: 1 }}>
                    <UpdatedAtText {...props} />
                </Box>
            )}

            <CreatedAtText {...props} />
        </Alert>
    );
}

import type { GenericEntity } from '@definitions/commonTypes';
import Grid from '@mui/material/Unstable_Grid2';
import type { ComponentType } from 'react';

interface Props<TEntity> {
    entities: TEntity[];
    Item: ComponentType<{ entity: TEntity }>;
}

export default function EntityCardGrid<TEntity extends GenericEntity>({ entities, Item }: Props<TEntity>) {
    return (
        <Grid container spacing={5} direction="row" justifyContent="center" alignItems="stretch">
            {entities.map((entity) => (
                <Grid key={entity._id} xs={12} md={6} lg={4}>
                    <Item entity={entity} />
                </Grid>
            ))}
        </Grid>
    );
}

import type { GenericEntity } from '@definitions/commonTypes';
import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';
import type { ComponentType } from 'react';

interface Props<TEntity> {
    entities: TEntity[];
    Item: ComponentType<{ entity: TEntity }>;
    spacing?: number;
    GridProps?: Grid2Props;
}

export default function EntityCardGrid<TEntity extends GenericEntity>({ entities, spacing = 5, Item }: Props<TEntity>) {
    return (
        <Grid container spacing={spacing} direction="row" justifyContent="center" alignItems="stretch">
            {entities.map((entity) => (
                <Grid key={entity._id} xs={12} md={6} lg={4}>
                    <Item entity={entity} />
                </Grid>
            ))}
        </Grid>
    );
}

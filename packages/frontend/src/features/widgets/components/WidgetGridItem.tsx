import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { ReactNode } from 'react';

export enum WidgetSize {
    Small,
    Medium,
    Large,
    ExtraLarge,
}

interface Props {
    children: ReactNode;
    size: WidgetSize;
}

const getGridSize = (size: WidgetSize) => {
    switch (size) {
        case WidgetSize.Small:
            return 4;
        case WidgetSize.Medium:
            return 6;
        case WidgetSize.Large:
            return 8;
        case WidgetSize.ExtraLarge:
            return 12;
        default:
            return 4;
    }
};

export const WidgetGridItem = ({ children, size }: Props) => {
    const gridSize = getGridSize(size);

    return <Grid xs={gridSize}>{children}</Grid>;
};

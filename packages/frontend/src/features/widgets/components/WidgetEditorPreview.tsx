import CleanWater from '@assets/icons/clean-water.png';
import { Switch, Typography } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { Widget } from './Widget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const cols = {
    lg: 12,
    md: 6,
    sm: 6,
    xs: 6,
    xxs: 1,
};

const breakpoints = {
    lg: 1900,
    md: 800,
    sm: 768,
    xs: 480,
    xxs: 0,
};

export const WidgetEditorPreview = () => {
    return (
        <ResponsiveGridLayout className="layout" cols={cols} breakpoints={breakpoints}>
            <div key="1">
                <Widget
                    icon={CleanWater}
                    title={'Zawór ogrodowy'}
                    content={<Typography variant="caption">Uruchomiony od 37 minut</Typography>}
                    action={<Switch defaultChecked color="success" />}
                />
            </div>
        </ResponsiveGridLayout>
    );
};

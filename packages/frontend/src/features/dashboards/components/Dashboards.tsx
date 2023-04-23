import { useDashboards } from '@api/dashboardApi';
import { Card, Typography } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

const cols = {
    lg: 1,
    md: 1,
    sm: 1,
    xs: 1,
    xxs: 1,
};

export const Dashboards = () => {
    const { data } = useDashboards({});

    return (
        <ResponsiveGridLayout cols={cols} className="layout">
            {data?._hits.map((dashboard) => (
                <div key={dashboard._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography>{dashboard.displayName}</Typography>
                    </Card>
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};

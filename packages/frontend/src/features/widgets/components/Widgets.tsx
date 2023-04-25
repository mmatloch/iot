import { useWidgets } from '@api/widgetsApi';
import { Card, Typography } from '@mui/material';

export const Widgets = () => {
    const { data } = useWidgets({});

    return (
        <>
            {data?._hits.map((dashboard) => (
                <div key={dashboard._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography>{dashboard.displayName}</Typography>
                    </Card>
                </div>
            ))}
        </>
    );
};

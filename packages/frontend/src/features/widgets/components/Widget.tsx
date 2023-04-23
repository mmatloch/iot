import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    icon: string;
    title: ReactNode;
    content?: ReactNode;
    action?: ReactNode;
}

export const Widget = ({ icon, title, action, content }: Props) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia component="img" sx={{ width: 48, pt: 2, pl: 2 }} image={icon} />
            <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {title}
                </Typography>

                {content}
            </CardContent>
            {action && <CardActions>{action}</CardActions>}
        </Card>
    );
};

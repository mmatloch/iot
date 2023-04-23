import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
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
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pl: 2, pt: 2 }}>
                <CardMedia component="img" sx={{ width: 32, p: 0 }} image={icon} />
                <Box sx={{ flexGrow: 1 }} />
                <Box>{action}</Box>
            </Stack>

            <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {title}
                </Typography>

                {content}
            </CardContent>

            <Box sx={{ pb: 1 }} />
        </Card>
    );
};

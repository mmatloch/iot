import { WidgetTextLine } from '@definitions/entities/widgetTypes';
import { useIcon } from '@hooks/useIcon';
import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    icon: string;
    title: ReactNode;
    textLines: WidgetTextLine[];
    content?: ReactNode;
    action?: ReactNode;
}

export const Widget = ({ icon, title, action, textLines }: Props) => {
    const iconUrl = useIcon(icon);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pl: 2, pt: 2 }}>
                <CardMedia component="img" sx={{ width: 32, p: 0 }} image={iconUrl} />
                <Box sx={{ flexGrow: 1 }} />
                <Box>{action}</Box>
            </Stack>

            <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {title}
                </Typography>

                <Stack>
                    {textLines.map((textLine) => (
                        <Typography variant="caption" key={textLine.id}>
                            {textLine.value}
                        </Typography>
                    ))}
                </Stack>
            </CardContent>

            <Box sx={{ pb: 1 }} />
        </Card>
    );
};

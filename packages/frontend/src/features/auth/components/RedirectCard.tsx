import { Card, CardContent } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default function RedirectCard({ children }: Props) {
    return (
        <Card sx={{ p: 3 }}>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

import { ListItemIcon, ListItemText } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
    text: string;
    icon: ReactNode;
}

export default function ListItemButtonWithIcon({ text, icon }: Props) {
    return (
        <>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{text}</ListItemText>
        </>
    );
}

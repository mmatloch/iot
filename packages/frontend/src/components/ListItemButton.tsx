import { ListItemIcon, ListItemText } from '@mui/material';
import { ReactNode } from 'react';

interface ListItemButtonProps {
    text: string;
    icon: ReactNode;
}

export default function ListItemButton({ text, icon }: ListItemButtonProps) {
    return (
        <>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{text}</ListItemText>
        </>
    );
}

import { Dashboard } from '@definitions/entities/dashboardTypes';
import { MoreVert } from '@mui/icons-material';
import { Card, CardHeader, IconButton } from '@mui/material';
import { MouseEvent, TouchEvent, useState } from 'react';

import DashboardMenu from './DashboardMenu';

interface Props {
    entity: Dashboard;
}

export const DashboardCard = ({ entity: dashboard }: Props) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const openMenu = (event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchorEl(null);
    };

    return (
        <>
            <Card>
                <CardHeader
                    title={dashboard.displayName}
                    action={
                        <IconButton onClick={openMenu} onTouchStart={openMenu}>
                            <MoreVert />
                        </IconButton>
                    }
                />
            </Card>

            <DashboardMenu dashboard={dashboard} onClose={closeMenu} anchorEl={menuAnchorEl} />
        </>
    );
};

import { Box, CssBaseline, Toolbar } from '@mui/material/';
import { ReactNode, useState } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    const [sidebarState, setSidebarState] = useState(false);

    const onSidebarClose = () => {
        setSidebarState(false);
    };

    const onHeaderMenuClick = () => {
        setSidebarState(!sidebarState);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Header onMenuClick={onHeaderMenuClick} />
            <Sidebar isOpen={sidebarState} onClose={onSidebarClose} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

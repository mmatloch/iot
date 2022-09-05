import { Backdrop, Grid } from '@mui/material';

import CircularProgressLoader from './CircularProgressLoader';

export default function FullScreenLoader() {
    const isOpen = true;

    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isOpen}>
            <CircularProgressLoader />
        </Backdrop>
    );
}

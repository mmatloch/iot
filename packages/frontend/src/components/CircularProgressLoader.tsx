import { Box, CircularProgress } from '@mui/material';

export default function CircularProgressLoader() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    );
}

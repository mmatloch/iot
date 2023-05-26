import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { Box, Divider, Stack } from '@mui/material';

import { TextLineCreator } from './TextLineCreator';

export const TextLineList = () => {
    const { watch } = useWidgetForm();
    const textLines = watch('textLines');

    return (
        <Stack spacing={1}>
            {textLines.map((field, index) => (
                <Box key={field.id}>
                    <TextLineCreator lineIndex={index} />
                    <Divider />
                </Box>
            ))}
        </Stack>
    );
};

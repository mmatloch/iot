import FormInputEditor from '@components/forms/FormInputEditor';
import libSdk from '@definitions/widgetSdk.d.ts?raw';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { OffActionEventSelector } from './OffActionEventSelector';
import { OnActionEventSelector } from './OnActionEventSelector';

const EDITOR_OPTIONS = {
    scrollbar: {
        useShadows: false,
        vertical: 'hidden' as const,
        horizontal: 'hidden' as const,
        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 0,
    },
};

export const ActionCreator = () => {
    const { t } = useTranslation('widgets');
    const { watch } = useWidgetForm();
    const action = watch('action');

    if (!action) {
        return null;
    }

    return (
        <>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Stack spacing={2}>
                        <Typography>{t('creator.actionOnDefinition')}</Typography>

                        <OnActionEventSelector />

                        <Typography variant="caption">{t('creator.actionOnContextDefinition')}</Typography>

                        <Box sx={{ height: 150 }}>
                            <FormInputEditor
                                name="action.on.eventContext"
                                language="json"
                                filename="onAction"
                                editorOptions={EDITOR_OPTIONS}
                            />
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs={6}>
                    <Stack spacing={2}>
                        <Typography>{t('creator.actionOffDefinition')}</Typography>

                        <OffActionEventSelector />

                        <Typography variant="caption">{t('creator.actionOffContextDefinition')}</Typography>

                        <Box sx={{ height: 150 }}>
                            <FormInputEditor
                                name="action.off.eventContext"
                                language="json"
                                filename="offAction"
                                editorOptions={EDITOR_OPTIONS}
                            />
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ mb: 1 }}>
                        <Typography>{t('creator.actionStateDefintion.title')}</Typography>
                        <Typography variant="caption">{t('creator.actionStateDefintion.description')}</Typography>
                    </Box>

                    <Box sx={{ height: 150 }}>
                        <FormInputEditor
                            name="action.stateDefinition"
                            language="javascript"
                            filename="offAction"
                            editorOptions={EDITOR_OPTIONS}
                            extraLib={libSdk}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

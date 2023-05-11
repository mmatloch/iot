import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EventEditorActionDefinitionForm from './EventEditor/EventEditorActionDefinitionForm';
import EventEditorBasicInformationForm from './EventEditor/EventEditorBasicInformationForm';
import EventEditorConditionDefinitionForm from './EventEditor/EventEditorConditionDefinitionForm';

export default function EventEditorForm() {
    const { t } = useTranslation('events');

    return (
        <Box>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>{t('editor.basicInformation.title')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <EventEditorBasicInformationForm />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>{t('editor.conditionDefinition.title')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <EventEditorConditionDefinitionForm />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>{t('editor.actionDefinition.title')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <EventEditorActionDefinitionForm />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

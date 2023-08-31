import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useWidgetForm } from '../hooks/useWidgetForm';
import { ActionCreator } from './Action/ActionCreator';

export const WidgetActionForm = () => {
    const { t } = useTranslation('widgets');
    const { setValue, watch } = useWidgetForm();

    const action = watch('action');

    console.log(action);

    const handleAddAction = () => {
        setValue('action', {
            on: {
                eventId: null,
                eventContext: '{}',
            },
            off: {
                eventId: null,
                eventContext: '{}',
            },
            stateDefinition: 'return true;',
        });
    };

    const handleRemoveAction = () => {
        setValue('action', null);
    };

    return (
        <>
            <ActionCreator />
            {action ? (
                <Button onClick={handleRemoveAction} sx={{ mt: 1 }}>
                    {t('creator.removeAction')}
                </Button>
            ) : (
                <Button onClick={handleAddAction} sx={{ mt: 1 }}>
                    {t('creator.addAction')}
                </Button>
            )}
        </>
    );
};

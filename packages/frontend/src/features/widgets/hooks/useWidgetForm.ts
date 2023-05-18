import { WidgetDto } from '@definitions/entities/widgetTypes';
import { useFormContext } from 'react-hook-form';

export const useWidgetForm = () => {
    return useFormContext<WidgetDto>();
};

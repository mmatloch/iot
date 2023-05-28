import { WidgetDto } from '@definitions/entities/widgetTypes';
import { useFieldArray } from 'react-hook-form';

export const useTextLinesForm = () => {
    return useFieldArray<WidgetDto>({
        name: 'textLines',
    });
};

import { DashboardDto, DashboardLayout } from '@definitions/entities/dashboardTypes';
import { WidgetContainer } from '@features/widgets';
import { useFormContext } from 'react-hook-form';

export const DashboardComposer = () => {
    const { watch, setValue } = useFormContext<DashboardDto>();
    const values = watch();

    const handleLayoutChange = (layout: DashboardLayout[]) => {
        setValue('layout', layout);
    };

    return <WidgetContainer layout={values.layout} onLayoutChange={handleLayoutChange} />;
};

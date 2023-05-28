import { useSwipeable } from 'react-swipeable';
import { useKey } from 'react-use';

interface Props {
    onNextDashboard: () => void;
    onPreviousDashboard: () => void;
}

export const useDashboardNavigation = ({ onPreviousDashboard, onNextDashboard }: Props) => {
    useKey('ArrowLeft', onPreviousDashboard, {}, [onPreviousDashboard]);
    useKey('ArrowRight', onNextDashboard, {}, [onNextDashboard]);

    const elementHandlers = useSwipeable({
        onSwipedLeft: onNextDashboard,
        onSwipedRight: onPreviousDashboard,
        swipeDuration: 500,
        preventScrollOnSwipe: true,
    });

    return {
        elementHandlers,
    };
};

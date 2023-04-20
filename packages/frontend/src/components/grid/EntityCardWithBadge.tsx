import type { BadgeProps, CardProps} from '@mui/material';
import { Badge, Card, styled } from '@mui/material';
import type { ReactNode } from 'react';

interface Props extends CardProps {
    badgeColor: BadgeProps['color'];
    badgeContent: BadgeProps['badgeContent'];
    children: ReactNode;
}

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
        transform: 'translate(10%, -50%)',
    },
}));

export default function EntityCardWithBadge({ children, badgeColor, badgeContent, ...cardProps }: Props) {
    return (
        <StyledBadge color={badgeColor} badgeContent={badgeContent} sx={{ height: 1, width: 1 }}>
            <Card {...cardProps} sx={{ p: 2, width: 1, ...cardProps.sx }}>
                {children}
            </Card>
        </StyledBadge>
    );
}

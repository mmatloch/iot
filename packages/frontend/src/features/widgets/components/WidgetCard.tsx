import { Widget } from '@definitions/entities/widgetTypes';
import { useIcon } from '@hooks/useIcon';
import { MoreVert } from '@mui/icons-material';
import { Box, Card, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';

import { WidgetActionSwitch } from './WidgetActionSwitch';
import WidgetMenu from './WidgetMenu';

interface Props {
    entity: Widget;
    hideEditAction?: boolean;
    disableAction?: boolean;
}

export const WidgetCard = ({ entity: widget, hideEditAction, disableAction }: Props) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchorEl(null);
    };

    const iconUrl = useIcon(widget.icon);

    const showAction = hideEditAction && widget.action;

    return (
        <>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pl: 2, pt: 2 }}>
                    <CardMedia component="img" sx={{ width: 32, p: 0 }} image={iconUrl} />
                    <Box sx={{ flexGrow: 1 }} />

                    {!hideEditAction && (
                        <IconButton onClick={openMenu}>
                            <MoreVert />
                        </IconButton>
                    )}

                    {showAction && <WidgetActionSwitch widget={widget} isDisabled={disableAction} />}
                </Stack>

                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {widget.displayName}
                    </Typography>

                    <Stack>
                        {widget.textLines.map((textLine) => (
                            <Typography variant="caption" key={textLine.id} sx={textLine.styles}>
                                {textLine.value}
                            </Typography>
                        ))}
                    </Stack>
                </CardContent>

                <Box sx={{ pb: 1 }} />
            </Card>

            <WidgetMenu widget={widget} onClose={closeMenu} anchorEl={menuAnchorEl} />
        </>
    );
};

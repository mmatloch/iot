import { EventsTriggerResponse } from '@definitions/eventTriggerTypes';
import { HttpError } from '@errors/httpError';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { TreeItem, TreeView } from '@mui/lab';
import { Alert, AlertTitle, Badge, Chip, Typography } from '@mui/material';

interface Props {
    data: EventsTriggerResponse | undefined;
    error: Error | null;
}

export default function EventTriggerResultPanel({ data, error }: Props) {
    if (error) {
        if (error instanceof HttpError) {
            return (
                <>
                    <Alert severity="error">
                        <AlertTitle>Wystąpił błąd (kod statusu: {error.statusCode})</AlertTitle>
                        {error.message}
                    </Alert>

                    <Alert severity="error">{error.detail}</Alert>
                </>
            );
        }

        return (
            <>
                <Alert severity="error">
                    <AlertTitle>Wystąpił nieznany błąd</AlertTitle>
                    {error.message}
                </Alert>
            </>
        );
    }

    if (!data) {
        return null;
    }

    return data.map(({ runId, summary }) => {
        return (
            <>
                <Chip label={`Run ID: ${runId}`} sx={{ mb: 2 }} />

                <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
                    <TreeItem nodeId="1" label="Applications">
                        <TreeItem nodeId="2" label="Calendar" />
                    </TreeItem>
                </TreeView>

                {summary.children.map(({ event }) => {
                    return <></>;
                })}
            </>
        );
    });
}

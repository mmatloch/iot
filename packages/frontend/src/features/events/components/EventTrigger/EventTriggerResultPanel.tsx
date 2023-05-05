import type { EventRunSummaryChild, EventsTriggerResponse } from '@definitions/eventTriggerTypes';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { TreeView } from '@mui/lab';
import { Box, Chip, Divider } from '@mui/material';
import { findNodeInResponse, toTree } from '@utils/eventTriggerTree';
import { buildTreeItems } from '@utils/tree';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import EventRunSummaryChildPanel from './EventRunSummaryChildPanel';
import EventTriggerResultError from './EventTriggerResultError';

interface Props {
    data: EventsTriggerResponse | undefined;
    error: Error | null;
}

export default function EventTriggerResultPanel({ data, error }: Props) {
    const { t } = useTranslation('events');
    const [selectedNode, setSelectedNode] = useState<EventRunSummaryChild>();

    if (error) {
        return <EventTriggerResultError error={error} />;
    }

    if (!data) {
        return <></>;
    }

    const handleNodeSelect = (_event: React.SyntheticEvent, nodeIds: string[]) => {
        const [nodeId] = nodeIds;

        const node = findNodeInResponse(nodeId, data);

        if (node) {
            setSelectedNode(node);
        }
    };

    return (
        <>
            {data.map(({ runId, summary }) => {
                return (
                    <Box key={runId}>
                        <Chip label={`${t('editor.triggerPanel.runId')}: ${runId}`} sx={{ mb: 2 }} />

                        <TreeView
                            defaultCollapseIcon={<ExpandMore />}
                            defaultExpandIcon={<ChevronRight />}
                            onNodeSelect={handleNodeSelect}
                        >
                            {buildTreeItems(toTree(summary.children))}
                        </TreeView>

                        <Divider sx={{ my: 2 }} />

                        {selectedNode && <EventRunSummaryChildPanel runSummary={selectedNode} />}
                    </Box>
                );
            })}
        </>
    );
}

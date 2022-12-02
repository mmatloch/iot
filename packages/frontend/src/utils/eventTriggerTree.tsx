import type { EventInstance} from '@definitions/entities/eventInstanceTypes';
import { EventInstanceState } from '@definitions/entities/eventInstanceTypes';
import type { EventRunSummaryChild, EventsTriggerResponse } from '@definitions/eventTriggerTypes';
import { Check, Close, Remove } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

import type { TreeItem } from './tree';

const getIcon = (eventInstance: EventInstance) => {
    switch (eventInstance.state) {
        case EventInstanceState.Success:
            return <Check color="success" />;

        case EventInstanceState.ConditionNotMet:
            return <Remove color="warning" />;

        default:
            return <Close color="error" />;
    }
};

export const toTree = (children: EventRunSummaryChild[]): TreeItem[] => {
    return children.map((child) => {
        return {
            children: toTree(child.children),
            label: (
                <Stack direction="row" alignItems="center" gap={1} sx={{ py: 1 }}>
                    <Typography>
                        [{child.event._id}] {child.event.displayName}
                    </Typography>
                    {getIcon(child.eventInstance)}
                </Stack>
            ),
            nodeId: String(child.event._id),
        };
    });
};

const findNode = (nodeId: string, children: EventRunSummaryChild[]): EventRunSummaryChild | undefined => {
    for (const child of children) {
        if (String(child.event._id) === nodeId) {
            return child;
        }

        const found = findNode(nodeId, child.children);

        if (found) {
            return found;
        }
    }
};

export const findNodeInResponse = (nodeId: string, result: EventsTriggerResponse): EventRunSummaryChild | undefined => {
    for (const { summary } of result) {
        const found = findNode(nodeId, summary.children);

        if (found) {
            return found;
        }
    }
};

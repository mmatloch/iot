import { TreeItem } from '@mui/lab';
import { ReactNode } from 'react';

export interface TreeItem {
    nodeId: string;
    label: ReactNode | string;
    children: TreeItem[];
}

export const buildTreeItems = (treeItems: TreeItem[]) => {
    return treeItems.map((treeItemData) => {
        let children = undefined;

        if (treeItemData.children && treeItemData.children.length > 0) {
            children = buildTreeItems(treeItemData.children);
        }

        return (
            <TreeItem
                key={treeItemData.nodeId}
                nodeId={treeItemData.nodeId}
                label={treeItemData.label}
                children={children}
            />
        );
    });
};

import {
    Tree,
    TreeItem,
    TreeItemContent,
    TreeItemTrigger,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function TreePreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Tree
                    className="w-full"
                    defaultExpanded={["src", "components"]}
                    defaultSelected="button"
                >
                    <TreeItem value="src">
                        <TreeItemTrigger>src</TreeItemTrigger>
                        <TreeItemContent>
                            <TreeItem value="components">
                                <TreeItemTrigger>components</TreeItemTrigger>
                                <TreeItemContent>
                                    <TreeItem value="button">
                                        <TreeItemTrigger>Button.tsx</TreeItemTrigger>
                                    </TreeItem>
                                    <TreeItem value="tree">
                                        <TreeItemTrigger>Tree.tsx</TreeItemTrigger>
                                    </TreeItem>
                                </TreeItemContent>
                            </TreeItem>
                            <TreeItem value="index">
                                <TreeItemTrigger>index.ts</TreeItemTrigger>
                            </TreeItem>
                        </TreeItemContent>
                    </TreeItem>
                    <TreeItem value="package">
                        <TreeItemTrigger>package.json</TreeItemTrigger>
                    </TreeItem>
                </Tree>
            </Look>
        </Looks>
    );
}

import { clsx } from "clsx";
import { useContext, useId, useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { TreeContext, TreeItemContext } from "./context";
import { treeStyles } from "./style";

export interface TreeItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "value"> {
    value: string;
    disabled?: boolean;
    children?: ReactNode;
}

export function TreeItem({ value, disabled = false, className, children, ...props }: TreeItemProps) {
    const tree = useContext(TreeContext);
    const parent = useContext(TreeItemContext);
    if (!tree) throw new Error("TreeItem must be used within Tree.");

    const [hasBranch, setHasBranch] = useState(false);
    const uid = useId().replace(/:/g, "");
    const depth = parent ? parent.depth + 1 : 0;
    const parentValue = parent?.value ?? null;
    const expanded = tree.isExpanded(value);
    const selected = tree.selected === value;
    const triggerId = `tree-trigger-${uid}-${value}`;
    const groupId = `tree-group-${uid}-${value}`;

    const itemContext = useMemo(
        () => ({
            value,
            depth,
            parentValue,
            expanded,
            selected,
            disabled,
            hasBranch,
            setHasBranch,
            triggerId,
            groupId,
        }),
        [value, depth, parentValue, expanded, selected, disabled, hasBranch, triggerId, groupId],
    );

    return (
        <TreeItemContext.Provider value={itemContext}>
            <li
                data-refineui="tree-item"
                data-depth={depth}
                data-expanded={hasBranch ? (expanded ? "true" : "false") : undefined}
                data-selected={selected || undefined}
                data-disabled={disabled || undefined}
                role="treeitem"
                aria-expanded={hasBranch ? expanded : undefined}
                aria-selected={selected}
                aria-disabled={disabled || undefined}
                className={clsx(treeStyles.item, className)}
                {...props}
            >
                {children}
            </li>
        </TreeItemContext.Provider>
    );
}

import { clsx } from "clsx";
import {
    useContext,
    useEffect,
    type HTMLAttributes,
    type KeyboardEvent,
    type MouseEvent,
} from "react";
import { WebIcon } from "../../WebIcon";
import { TreeContext, TreeItemContext } from "./context";
import { treeIconSize, treeItemTypo, treeStyles } from "./style";

export interface TreeItemTriggerProps extends HTMLAttributes<HTMLDivElement> {}

export function TreeItemTrigger({ className, children, onClick, onKeyDown, ...props }: TreeItemTriggerProps) {
    const tree = useContext(TreeContext);
    const item = useContext(TreeItemContext);
    if (!tree || !item) throw new Error("TreeItemTrigger must be used within TreeItem.");

    const iconSize = treeIconSize[tree.size];
    /** One tree column = icon slot + label gap (matches Select item indicator stride). */
    const depthIndent =
        "calc(var(--refineui-spacing-size-large) + var(--refineui-spacing-size-x-small))";
    const mainStyle = {
        paddingInlineStart:
            item.depth > 0 ? `calc(${depthIndent} * ${item.depth})` : undefined,
    };

    useEffect(() => {
        return () => {
            tree.registerItem(item.value, null, {
                parentValue: item.parentValue,
                disabled: item.disabled,
            });
        };
    }, [item.disabled, item.parentValue, item.value, tree.registerItem]);

    const setRowRef = (el: HTMLDivElement | null) => {
        tree.registerItem(item.value, el, {
            parentValue: item.parentValue,
            disabled: item.disabled,
        });
    };

    const onChevronClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (item.disabled || !item.hasBranch) return;
        tree.toggleExpanded(item.value);
    };

    const onRowClick = (event: MouseEvent<HTMLDivElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || item.disabled) return;
        tree.select(item.value);
        if (item.hasBranch) {
            tree.toggleExpanded(item.value);
        }
    };

    const onRowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || item.disabled) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                tree.focusByDelta(item.value, 1);
                break;
            case "ArrowUp":
                event.preventDefault();
                tree.focusByDelta(item.value, -1);
                break;
            case "ArrowRight":
                event.preventDefault();
                if (item.hasBranch) {
                    if (!item.expanded) tree.expand(item.value);
                    else tree.focusByDelta(item.value, 1);
                }
                break;
            case "ArrowLeft":
                event.preventDefault();
                if (item.hasBranch && item.expanded) {
                    tree.collapse(item.value);
                } else {
                    const parent = tree.getParent(item.value);
                    if (parent) tree.focusItem(parent);
                }
                break;
            case "Home":
                event.preventDefault();
                tree.focusFirst();
                break;
            case "End":
                event.preventDefault();
                tree.focusLast();
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                tree.select(item.value);
                if (item.hasBranch) {
                    tree.toggleExpanded(item.value);
                }
                break;
            default:
                break;
        }
    };

    return (
        <div
            ref={setRowRef}
            id={item.triggerId}
            data-refineui="tree-item-trigger"
            data-selected={item.selected ? "true" : undefined}
            data-disabled={item.disabled ? "true" : undefined}
            tabIndex={item.disabled ? -1 : 0}
            onClick={onRowClick}
            onKeyDown={onRowKeyDown}
            className={clsx(
                treeStyles.row,
                treeItemTypo[tree.size],
                item.selected && treeStyles.rowSelected,
                item.disabled && treeStyles.rowDisabled,
                className,
            )}
            {...props}
        >
            <div data-refineui="tree-item-main" className={treeStyles.rowMain} style={mainStyle}>
                {item.hasBranch ? (
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label={item.expanded ? "Collapse" : "Expand"}
                        data-refineui="tree-item-chevron"
                        disabled={item.disabled}
                        onClick={onChevronClick}
                        className={clsx(
                            treeStyles.chevronButton,
                            item.expanded && treeStyles.chevronExpanded,
                            tree.reduceMotion && "transition-none",
                        )}
                    >
                        <WebIcon name="chevron-right" size={iconSize} color="currentColor" fallback="›" />
                    </button>
                ) : (
                    <span className={treeStyles.chevronSpacer} aria-hidden="true" />
                )}
                <span className={treeStyles.label}>{children}</span>
            </div>
        </div>
    );
}

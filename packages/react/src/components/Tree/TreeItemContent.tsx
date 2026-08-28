import { clsx } from "clsx";
import { useContext, useLayoutEffect, type CSSProperties, type HTMLAttributes } from "react";
import {
    TREE_CONTENT_EASE,
    TREE_CONTENT_MS,
    TREE_PANEL_EASE,
    TREE_PANEL_MS,
    TreeContext,
    TreeItemContext,
} from "./context";
import { treeStyles } from "./style";

export interface TreeItemContentProps extends HTMLAttributes<HTMLUListElement> {}

export function TreeItemContent({ className, children, ...props }: TreeItemContentProps) {
    const tree = useContext(TreeContext);
    const item = useContext(TreeItemContext);
    if (!tree || !item) throw new Error("TreeItemContent must be used within TreeItem.");

    const { setHasBranch, expanded, groupId, triggerId } = item;

    useLayoutEffect(() => {
        setHasBranch(true);
        return () => setHasBranch(false);
    }, [setHasBranch]);

    const gridStyle: CSSProperties = {
        display: "grid",
        gridTemplateRows: expanded ? "1fr" : "0fr",
        transition: tree.reduceMotion ? undefined : `grid-template-rows ${TREE_PANEL_MS}s ${TREE_PANEL_EASE}`,
    };

    const innerMotionStyle: CSSProperties = {
        opacity: expanded ? 1 : 0,
        transform: expanded
            ? "translate3d(0, 0, 0)"
            : "translate3d(0, calc(-1 * var(--refineui-spacing-size-x-small)), 0)",
        transition: tree.reduceMotion
            ? undefined
            : `opacity ${TREE_CONTENT_MS}s ${TREE_CONTENT_EASE}, transform ${TREE_CONTENT_MS}s ${TREE_CONTENT_EASE}`,
        pointerEvents: expanded ? undefined : "none",
    };

    return (
        <div
            ref={(el) => {
                if (!el) return;
                if (expanded) el.removeAttribute("inert");
                else el.setAttribute("inert", "");
            }}
            data-refineui="tree-item-panel"
            aria-hidden={!expanded}
            style={gridStyle}
        >
            <div className={treeStyles.panel}>
                <div className={treeStyles.panelInner} style={innerMotionStyle}>
                    <ul
                        id={groupId}
                        role="group"
                        aria-labelledby={triggerId}
                        data-refineui="tree-item-content"
                        className={clsx(treeStyles.group, className)}
                        {...props}
                    >
                        {children}
                    </ul>
                </div>
            </div>
        </div>
    );
}

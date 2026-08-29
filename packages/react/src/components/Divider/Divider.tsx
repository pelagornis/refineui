import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { componentSizes } from "../../componentSizes";
import { dividerStyles } from "./style";
import type { DividerAlign, DividerProps } from "./types";

function LineSegment({ grow }: { grow: boolean }) {
    return (
        <div
            data-name="Vector"
            className={clsx(
                dividerStyles.line,
                grow ? dividerStyles.lineGrow : dividerStyles.lineShort,
            )}
        />
    );
}

function DividerCircleGlyph() {
    return (
        <span
            aria-hidden
            className={dividerStyles.iconCircle}
            style={{
                width: componentSizes.dividerIconCircleDiameter,
                height: componentSizes.dividerIconCircleDiameter,
            }}
        />
    );
}

/** Divider — layout default · content · icon; align center · left · right (horizontal). */
export function Divider(props: DividerProps) {
    const p = props as Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
        layout?: "default" | "content" | "icon";
        align?: DividerAlign;
        children?: ReactNode;
    };
    const { layout = "default", align = "center", children, className, ...htmlProps } = p;

    const effectiveLayout =
        layout === "icon" ? "icon" : layout === "content" && children != null ? "content" : "default";

    if (effectiveLayout === "default") {
        return (
            <div
                data-refineui="divider"
                data-layout="default"
                role="separator"
                aria-orientation="horizontal"
                className={clsx(
                    dividerStyles.default,
                    className,
                )}
                {...htmlProps}
            />
        );
    }

    const isLeft = align === "left";
    const isRight = align === "right";

    const rowClass = dividerStyles.row;

    if (effectiveLayout === "content") {
        return (
            <div
                data-refineui="divider"
                data-layout="content"
                data-align={align}
                data-name="Divider"
                role="separator"
                aria-orientation="horizontal"
                className={clsx(rowClass, className)}
                {...htmlProps}
            >
                <LineSegment grow={!isLeft} />
                <span className={dividerStyles.contentLabel}>
                    {children}
                </span>
                <LineSegment grow={!isRight} />
            </div>
        );
    }

    return (
        <div
            data-refineui="divider"
            data-layout="icon"
            data-align={align}
            data-name="Divider"
            role="separator"
            aria-orientation="horizontal"
            className={clsx(rowClass, className)}
            {...htmlProps}
        >
            <LineSegment grow={!isLeft} />
            <div
                data-name="Circle"
                className={dividerStyles.iconSlot}
            >
                <DividerCircleGlyph />
            </div>
            <LineSegment grow={!isRight} />
        </div>
    );
}

import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { componentSizes } from "../../componentSizes";

type DividerHTML = Omit<HTMLAttributes<HTMLDivElement>, "children">;
type Align = "center" | "left" | "right";

function LineSegment({ grow }: { grow: boolean }) {
    return (
        <div
            data-name="Vector"
            className={clsx(
                "h-(--refineui-stroke-width-thin) min-h-(--refineui-stroke-width-thin) shrink-0 bg-refineui-alias-border-default",
                grow ? "min-w-0 flex-1" : "min-w-refineui-divider-short-end w-refineui-divider-short-end",
            )}
        />
    );
}

function DividerCircleGlyph() {
    return (
        <span
            aria-hidden
            className="absolute left-refineui-divider-icon-circle-inset top-refineui-divider-icon-circle-inset box-border rounded-refineui-circle border-refineui-thin border-refineui-alias-foreground-brand"
            style={{
                width: componentSizes.dividerIconCircleDiameter,
                height: componentSizes.dividerIconCircleDiameter,
            }}
        />
    );
}

export type DividerProps =
    | (DividerHTML & { layout?: "default" })
    | (DividerHTML & { layout: "content"; children: ReactNode; align?: Align })
    | (DividerHTML & { layout: "icon"; align?: Align });

/** Web Kit COMPONENT_SET `Divider` `346:722` — `layout` default · content · icon, `align` center · left · right(수평만). §8 `design-specs-web-kit.md`. */
export function Divider(props: DividerProps) {
    const p = props as DividerHTML & {
        layout?: "default" | "content" | "icon";
        align?: Align;
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
                    "box-border h-(--refineui-stroke-width-thin) min-h-(--refineui-stroke-width-thin) w-full border-none bg-refineui-alias-border-default",
                    className,
                )}
                {...htmlProps}
            />
        );
    }

    const isLeft = align === "left";
    const isRight = align === "right";

    const rowClass =
        "box-border flex w-full items-center justify-center gap-refineui-size-medium overflow-hidden";

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
                <span className="refineui-typo-caption-2 whitespace-nowrap text-refineui-alias-foreground-brand">
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
                className="relative min-w-refineui-divider-icon-slot size-refineui-divider-icon-slot shrink-0 overflow-visible"
            >
                <DividerCircleGlyph />
            </div>
            <LineSegment grow={!isRight} />
        </div>
    );
}

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { colors, spacings, strokeWidths, typographys, sizes } from "@refineui/tokens";

type DividerHTML = Omit<HTMLAttributes<HTMLDivElement>, "children">;
type Align = "center" | "left" | "right";

function px(value: string) {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : 0;
}

function LineSegment({ grow }: { grow: boolean }) {
    return (
        <div
            data-name="Vector"
            style={{
                height: strokeWidths.strokeWidthThin,
                minHeight: strokeWidths.strokeWidthThin,
                backgroundColor: colors.neutral300,
                flexShrink: 0,
                width: grow ? undefined : sizes.dividerShortEnd,
                flex: grow ? "1 0 0" : undefined,
                minWidth: grow ? 0 : sizes.dividerShortEnd,
            }}
        />
    );
}

function DividerCircleGlyph({ stroke }: { stroke: string }) {
    const dPx = px(sizes.dividerIconCircleDiameter);
    const strokePx = px(strokeWidths.strokeWidthThin);
    const r = dPx / 2;
    return (
        <svg
            width={sizes.dividerIconCircleDiameter}
            height={sizes.dividerIconCircleDiameter}
            viewBox={`0 0 ${dPx} ${dPx}`}
            fill="none"
            aria-hidden
            style={{
                position: "absolute",
                left: sizes.dividerIconCircleInset,
                top: sizes.dividerIconCircleInset,
                display: "block",
            }}
        >
            <circle cx={dPx / 2} cy={dPx / 2} r={r} stroke={stroke} strokeWidth={strokePx} />
        </svg>
    );
}

export type DividerProps =
    | (DividerHTML & { layout?: "default" })
    | (DividerHTML & { layout: "content"; children: ReactNode; align?: Align })
    | (DividerHTML & { layout: "icon"; align?: Align });

export function Divider(props: DividerProps) {
    const p = props as DividerHTML & {
        layout?: "default" | "content" | "icon";
        align?: Align;
        children?: ReactNode;
    };
    const { layout = "default", align = "center", children, style, ...htmlProps } = p;

    const effectiveLayout =
        layout === "icon" ? "icon" : layout === "content" && children != null ? "content" : "default";

    if (effectiveLayout === "default") {
        return (
            <div
                data-refineui="divider"
                data-layout="default"
                role="separator"
                aria-orientation="horizontal"
                style={{
                    boxSizing: "border-box",
                    width: "100%",
                    height: strokeWidths.strokeWidthThin,
                    minHeight: strokeWidths.strokeWidthThin,
                    backgroundColor: colors.neutral300,
                    border: "none",
                    ...style,
                }}
                {...htmlProps}
            />
        );
    }

    const isLeft = align === "left";
    const isRight = align === "right";

    const rowStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: spacings.sizeMedium,
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
    };

    if (effectiveLayout === "content") {
        return (
            <div
                data-refineui="divider"
                data-layout="content"
                data-align={align}
                data-name="Divider"
                role="separator"
                aria-orientation="horizontal"
                style={{ ...rowStyle, ...style }}
                {...htmlProps}
            >
                <LineSegment grow={!isLeft} />
                <span
                    style={{
                        ...typographys.caption2,
                        color: colors.neutralBlack,
                        whiteSpace: "nowrap",
                    }}
                >
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
            style={{ ...rowStyle, ...style }}
            {...htmlProps}
        >
            <LineSegment grow={!isLeft} />
            <div
                data-name="Circle"
                style={{
                    position: "relative",
                    width: sizes.dividerIconSlot,
                    height: sizes.dividerIconSlot,
                    minWidth: sizes.dividerIconSlot,
                    flexShrink: 0,
                    overflow: "hidden",
                }}
            >
                <DividerCircleGlyph stroke={colors.neutralBlack} />
            </div>
            <LineSegment grow={!isRight} />
        </div>
    );
}

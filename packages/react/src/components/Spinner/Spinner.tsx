import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

/** Web Kit COMPONENT_SET `Spinner` `550:3669` — Figma `XSmall` … `XXLarge` */
export type SpinnerSize = "xSmall" | "small" | "medium" | "large" | "xLarge" | "xxLarge";

/** 라벨 대비 스피너 위치 — Figma `position` Left / Right / Top / Bottom */
export type SpinnerLabelPosition = "left" | "right" | "top" | "bottom";

const spinnerRingClass: Record<SpinnerSize, string> = {
    xSmall:
        "size-refineui-spinner-size-xsmall [border-width:var(--refineui-size-spinner-ring-width-xsmall)]",
    small: "size-refineui-spinner-size-small [border-width:var(--refineui-size-spinner-ring-width-small)]",
    medium:
        "size-refineui-spinner-size-medium [border-width:var(--refineui-size-spinner-ring-width-medium)]",
    large: "size-refineui-spinner-size-large [border-width:var(--refineui-size-spinner-ring-width-large)]",
    xLarge:
        "size-refineui-spinner-size-xlarge [border-width:var(--refineui-size-spinner-ring-width-xlarge)]",
    xxLarge:
        "size-refineui-spinner-size-xxlarge [border-width:var(--refineui-size-spinner-ring-width-xxlarge)]",
};

const labelTypo: Record<SpinnerSize, string> = {
    xSmall: "refineui-typo-caption-1",
    small: "refineui-typo-body-2",
    medium: "refineui-typo-body-1",
    large: "refineui-typo-sub-title-2",
    xLarge: "refineui-typo-sub-title-1",
    xxLarge: "refineui-typo-title-3",
};

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    size?: SpinnerSize;
    /** 라벨이 있을 때만 표시 — Figma `showLabel` */
    label?: ReactNode;
    /** Figma 기본 `Right` — 라벨 왼쪽·스피너 오른쪽 */
    labelPosition?: SpinnerLabelPosition;
}

/** Web Kit COMPONENT_SET `Spinner` `550:3669` — `docs/design-specs-web-kit.md` Spinner 절. */
export function Spinner({
    size = "medium",
    label,
    labelPosition = "right",
    className,
    ...props
}: SpinnerProps) {
    const hasLabel = label != null && label !== "";

    const icon = (
        <div
            data-refineui="spinner"
            data-size={size}
            className={clsx(
                "box-border rounded-refineui-circle border-solid border-refineui-alias-background-brand-subtle border-t-refineui-alias-background-brand",
                spinnerRingClass[size],
            )}
            aria-hidden={hasLabel ? true : undefined}
        />
    );

    const labelEl = <span className={clsx(labelTypo[size], "text-refineui-alias-foreground-primary")}>{label}</span>;

    if (!hasLabel) {
        return (
            <div role="status" aria-label="Loading" className={className} {...props}>
                {icon}
            </div>
        );
    }

    const row = labelPosition === "left" || labelPosition === "right";
    const iconFirst = labelPosition === "left" || labelPosition === "top";

    return (
        <div
            role="status"
            aria-label="Loading"
            className={clsx(
                "inline-flex items-center justify-center gap-refineui-size-small",
                row ? "flex-row" : "flex-col",
                className,
            )}
            {...props}
        >
            {iconFirst ? (
                <>
                    {icon}
                    {labelEl}
                </>
            ) : (
                <>
                    {labelEl}
                    {icon}
                </>
            )}
        </div>
    );
}

import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";
import { useId, useRef } from "react";

/**
 * Web Kit COMPONENT_SET `Radio` `397:1001` + `Radio / Input` — 라벨·설명 색은 MCP Alias, 원 컨트롤은 `refineui.css` `[data-refineui="radio"]`.
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    /** 보조 한 줄 — MCP `caption3` + `alias.foregroundSecondary` */
    description?: string;
    /** 같은 라디오를 다시 클릭하면 해제 (Web Kit State/Checked 전환 검증용) */
    allowUncheck?: boolean;
}

export function Radio({
    label,
    description,
    id,
    className,
    disabled,
    allowUncheck = true,
    onClick,
    ...props
}: RadioProps) {
    const uid = useId();
    const inputId = id ?? uid;
    const showText = Boolean(label || description);
    const wasCheckedRef = useRef(false);

    return (
        <label
            htmlFor={inputId}
            className={clsx(
                "inline-flex gap-refineui-size-medium p-refineui-size-xxsmall",
                description ? "items-start" : "items-center",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                className,
            )}
        >
            <input
                id={inputId}
                type="radio"
                data-refineui="radio"
                disabled={disabled}
                className={clsx(
                    "size-refineui-control-checkbox-radio shrink-0 cursor-pointer",
                    description && "mt-refineui-size-xxsmall",
                    disabled && "cursor-not-allowed",
                )}
                onMouseDown={(e) => {
                    wasCheckedRef.current = e.currentTarget.checked;
                }}
                onClick={(e) => {
                    onClick?.(e);
                    if (
                        e.defaultPrevented ||
                        !allowUncheck ||
                        disabled ||
                        !wasCheckedRef.current
                    ) {
                        return;
                    }
                    e.preventDefault();
                    e.currentTarget.checked = false;
                    e.currentTarget.dispatchEvent(new Event("input", { bubbles: true }));
                    e.currentTarget.dispatchEvent(new Event("change", { bubbles: true }));
                }}
                {...props}
            />
            {showText && (
                <span className="flex min-w-0 flex-col gap-refineui-size-small">
                    {label && (
                        <span
                            className={clsx(
                                "refineui-typo-caption-1",
                                disabled
                                    ? "text-refineui-alias-foreground-disabled"
                                    : "text-refineui-alias-foreground-primary",
                            )}
                        >
                            {label}
                        </span>
                    )}
                    {description && (
                        <span
                            className={clsx(
                                "refineui-typo-caption-3",
                                disabled
                                    ? "text-refineui-alias-foreground-disabled"
                                    : "text-refineui-alias-foreground-secondary",
                            )}
                        >
                            {description}
                        </span>
                    )}
                </span>
            )}
        </label>
    );
}

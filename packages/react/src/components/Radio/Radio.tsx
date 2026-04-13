import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";

/**
 * Web Kit COMPONENT_SET `Radio` `397:1001` — 라벨·보조 설명, 인터랙션은 `refineui.css` `[data-refineui="radio"]`.
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    /** 보조 한 줄 (Figma `description` / `caption3`) */
    description?: string;
}

export function Radio({ label, description, id, className, disabled, ...props }: RadioProps) {
    const uid = useId();
    const inputId = id ?? uid;
    const showText = Boolean(label || description);

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
                {...props}
            />
            {showText && (
                <span className="flex min-w-0 flex-col gap-refineui-size-small">
                    {label && (
                        <span
                            className={clsx(
                                "refineui-typo-caption-1",
                                disabled ? "text-refineui-neutral-600" : "text-refineui-primary-black",
                            )}
                        >
                            {label}
                        </span>
                    )}
                    {description && (
                        <span className="refineui-typo-caption-3 text-refineui-neutral-600">{description}</span>
                    )}
                </span>
            )}
        </label>
    );
}

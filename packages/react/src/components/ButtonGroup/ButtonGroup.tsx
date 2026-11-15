import { clsx } from "clsx";
import { forwardRef, useMemo } from "react";
import { ButtonGroupContext } from "./context";
import { buttonGroupStyles } from "./style";
import type { ButtonGroupProps } from "./types";

/** Bundles related Buttons. `attached` (default) wraps them in one tube outline; size and variant cascade. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
    { size = "md", variant = "ghost", orientation = "horizontal", attached = true, className, children, ...props },
    ref,
) {
    const value = useMemo(() => ({ size, variant }), [size, variant]);
    return (
        <ButtonGroupContext.Provider value={value}>
            <div
                ref={ref}
                role="group"
                data-refineui="button-group"
                data-size={size}
                data-variant={variant}
                data-orientation={orientation}
                data-attached={attached ? "true" : undefined}
                aria-orientation={orientation}
                className={clsx(
                    buttonGroupStyles.root,
                    orientation === "vertical" && buttonGroupStyles.vertical,
                    attached ? [buttonGroupStyles.attached, buttonGroupStyles.attachedRadius[size]] : buttonGroupStyles.separate,
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </ButtonGroupContext.Provider>
    );
});

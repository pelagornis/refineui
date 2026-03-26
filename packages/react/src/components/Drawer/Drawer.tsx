import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { colors, spacings, typographys, shadows, toBoxShadow, zIndex, strokeWidths, overlays, sizes, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    placement?: "left" | "right";
    children: ReactNode;
}

export function Drawer({
    open,
    onClose,
    title,
    placement = "right",
    children,
    style,
    ...props
}: DrawerProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    useFocusTrap(open, panelRef);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        if (open) {
            document.addEventListener("keydown", handler);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    const isLeft = placement === "left";

    return (
        <div
            data-refineui="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: zIndex.zIndexPopup,
                display: "flex",
                justifyContent: isLeft ? "flex-start" : "flex-end",
            }}
            {...props}
        >
            <div
                role="presentation"
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: overlays.backdrop,
                    cursor: "pointer",
                }}
                onClick={onClose}
                aria-hidden
            />
            <div
                ref={panelRef}
                tabIndex={-1}
                style={{
                    position: "relative",
                    width: `min(${sizes.drawerMaxWidth}, 90vw)`,
                    maxWidth: sizes.drawerMaxWidth,
                    height: "100%",
                    backgroundColor: colors.neutralWhite,
                    boxShadow: toBoxShadow(shadows.shadow8Light),
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    outline: "none",
                    ...style,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: spacings.sizeMedium,
                            padding: spacings.sizeLarge,
                            borderBottom: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                        }}
                    >
                        <div id={titleId} style={{ flex: 1, minWidth: 0, ...typographys.title2, color: colors.primaryBlack }}>
                            {title}
                        </div>
                        <button
                            type="button"
                            data-refineui="drawer-close"
                            aria-label="닫기"
                            onClick={onClose}
                            style={{
                                flexShrink: 0,
                                background: "none",
                                border: "none",
                                padding: spacings.sizeXXSmall,
                                cursor: "pointer",
                                color: colors.neutral600,
                                display: "inline-flex",
                                alignItems: "center",
                                lineHeight: 1,
                            }}
                        >
                            <WebIcon name="dismiss" size={iconSizes.xl} color="currentColor" />
                        </button>
                    </div>
                )}
                <div
                    style={{
                        flex: 1,
                        overflow: "auto",
                        padding: spacings.sizeLarge,
                        ...typographys.body2,
                        color: colors.primaryBlack,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

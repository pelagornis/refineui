import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    colors,
    spacings,
    borderRadii,
    typographys,
    shadows,
    toBoxShadow,
    zIndex,
    strokeWidths,
    overlays,
    sizes,
    iconSizes,
} from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { useFocusTrap } from "../../hooks/useFocusTrap";

const PANEL_MS = 320;
const SCRIM_MS = 280;
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    children: ReactNode;
}

export function Dialog({ open, onClose, title, children, style, ...props }: DialogProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const [rendering, setRendering] = useState(open);
    const [entered, setEntered] = useState(false);

    useFocusTrap(open && entered, panelRef);

    useEffect(() => {
        if (open) {
            setRendering(true);
            const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
            return () => cancelAnimationFrame(id);
        }
        setEntered(false);
        const t = window.setTimeout(() => setRendering(false), PANEL_MS);
        return () => window.clearTimeout(t);
    }, [open]);

    useEffect(() => {
        if (!rendering) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [rendering]);

    useEffect(() => {
        if (!rendering || !entered) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [rendering, entered, onClose]);

    if (!rendering) return null;
    if (typeof document === "undefined") return null;

    const root = (
        <div
            data-refineui="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: zIndex.zIndexMessages,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: spacings.sizeLarge,
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
                    opacity: entered ? 1 : 0,
                    transition: `opacity ${SCRIM_MS}ms ${EASING}`,
                    pointerEvents: entered ? "auto" : "none",
                }}
                onClick={onClose}
                aria-hidden
            />
            <div
                ref={panelRef}
                tabIndex={-1}
                style={{
                    position: "relative",
                    backgroundColor: colors.neutralWhite,
                    borderRadius: borderRadii.roundedLarge,
                    boxSizing: "border-box",
                    boxShadow: toBoxShadow(shadows.shadow8Light),
                    maxWidth: sizes.dialogMaxWidth,
                    width: "100%",
                    maxHeight: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    outline: "none",
                    opacity: entered ? 1 : 0,
                    transform: entered ? "scale(1) translateY(0)" : "scale(0.96) translateY(8px)",
                    transition: `opacity ${PANEL_MS}ms ${EASING}, transform ${PANEL_MS}ms ${EASING}`,
                    willChange: "opacity, transform",
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
                            flexShrink: 0,
                        }}
                    >
                        <div id={titleId} style={{ flex: 1, minWidth: 0, ...typographys.title2, color: colors.primaryBlack }}>
                            {title}
                        </div>
                        <button
                            type="button"
                            data-refineui="dialog-close"
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
                        minHeight: 0,
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

    return createPortal(root, document.body);
}

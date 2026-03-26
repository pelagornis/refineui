import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    colors,
    spacings,
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

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    placement?: "left" | "right";
    /** Web Kit `635:1756` — Overlay panel width */
    size?: "small" | "medium" | "large";
    children: ReactNode;
}

function widthToken(s: "small" | "medium" | "large"): string {
    switch (s) {
        case "medium":
            return sizes.drawerWidthMd;
        case "large":
            return sizes.drawerWidthLg;
        default:
            return sizes.drawerWidthSm;
    }
}

export function Drawer({
    open,
    onClose,
    title,
    placement = "right",
    size = "small",
    children,
    style,
    ...props
}: DrawerProps) {
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

    const isLeft = placement === "left";
    const w = widthToken(size);
    const offX = isLeft ? "-100%" : "100%";

    const root = (
        <div
            data-refineui="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: zIndex.zIndexMessages,
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
                    width: `min(${w}, 100vw)`,
                    maxWidth: w,
                    height: "100%",
                    backgroundColor: colors.neutralWhite,
                    boxShadow: toBoxShadow(shadows.shadow16Light),
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    outline: "none",
                    boxSizing: "border-box",
                    transform: entered ? "translateX(0)" : `translateX(${offX})`,
                    transition: `transform ${PANEL_MS}ms ${EASING}`,
                    willChange: "transform",
                    ...style,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    data-name="Drawer / Header"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacings.sizeSmall,
                        paddingTop: spacings.sizeXXLarge,
                        paddingLeft: spacings.sizeXXLarge,
                        paddingRight: spacings.sizeXXLarge,
                        paddingBottom: spacings.sizeMedium,
                        flexShrink: 0,
                    }}
                >
                    <button
                        type="button"
                        data-refineui="drawer-close"
                        data-name="Dismiss"
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
                    {title != null && (
                        <div
                            id={titleId}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                ...typographys.subTitle1,
                                color: colors.primaryBlack,
                            }}
                        >
                            {title}
                        </div>
                    )}
                </div>
                <div
                    data-name="Divider"
                    style={{
                        height: strokeWidths.strokeWidthThin,
                        minHeight: strokeWidths.strokeWidthThin,
                        backgroundColor: colors.neutral300,
                        flexShrink: 0,
                        width: "100%",
                    }}
                />
                <div
                    data-name="Body"
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "auto",
                        padding: spacings.sizeXXLarge,
                        boxSizing: "border-box",
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

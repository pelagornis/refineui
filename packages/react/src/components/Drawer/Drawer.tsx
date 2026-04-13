import { clsx } from "clsx";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { overlays, iconSizes } from "@refineui/tokens";
import { componentSizes } from "../../componentSizes";
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
    /** Web Kit Overlay `635:1756` — `componentSizes.drawerWidthSm` / `Md` / `Lg` */
    size?: "small" | "medium" | "large";
    children: ReactNode;
}

function widthToken(s: "small" | "medium" | "large"): string {
    switch (s) {
        case "medium":
            return componentSizes.drawerWidthMd;
        case "large":
            return componentSizes.drawerWidthLg;
        default:
            return componentSizes.drawerWidthSm;
    }
}

/** Web Kit COMPONENT_SET `Drawer` `635:1756` — Overlay만; 폭·헤더·Divider·본문은 `docs/design-specs-web-kit.md` Drawer 절. */
export function Drawer({
    open,
    onClose,
    title,
    placement = "right",
    size = "small",
    children,
    className,
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

    const panelMotion: CSSProperties = {
        width: `min(${w}, 100vw)`,
        maxWidth: w,
        transform: entered ? "translateX(0)" : `translateX(${offX})`,
        transition: `transform ${PANEL_MS}ms ${EASING}`,
        willChange: "transform",
    };

    const root = (
        <div
            data-refineui="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            className={clsx(
                "fixed inset-0 z-refineui-messages flex",
                isLeft ? "justify-start" : "justify-end",
                className,
            )}
            {...props}
        >
            <div
                role="presentation"
                className="absolute inset-0 cursor-pointer transition-opacity"
                style={{
                    backgroundColor: overlays.backdrop,
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
                className="relative box-border flex h-full flex-col overflow-hidden bg-refineui-neutral-white shadow-refineui-16light outline-none"
                style={{ ...panelMotion, ...style }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    data-name="Drawer / Header"
                    className="flex shrink-0 flex-row items-center gap-refineui-size-small px-refineui-size-xxlarge pb-refineui-size-medium pt-refineui-size-xxlarge"
                >
                    <button
                        type="button"
                        data-refineui="drawer-close"
                        data-name="Dismiss"
                        aria-label="닫기"
                        onClick={onClose}
                        className="inline-flex shrink-0 cursor-pointer items-center border-none bg-transparent p-refineui-size-xxsmall leading-none text-refineui-neutral-600"
                    >
                        <WebIcon name="dismiss" size={iconSizes.xlarge} color="currentColor" />
                    </button>
                    {title != null && (
                        <div id={titleId} className="refineui-typo-sub-title-1 min-w-0 flex-1 text-refineui-primary-black">
                            {title}
                        </div>
                    )}
                </div>
                <div
                    data-name="Divider"
                    className="h-[length:var(--refineui-stroke-width-thin)] min-h-[length:var(--refineui-stroke-width-thin)] w-full shrink-0 bg-refineui-neutral-300"
                />
                <div
                    data-name="Body"
                    className="refineui-typo-body-2 box-border min-h-0 flex-1 overflow-auto p-refineui-size-xxlarge text-refineui-primary-black"
                >
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(root, document.body);
}

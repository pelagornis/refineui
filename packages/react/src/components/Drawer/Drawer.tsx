import { clsx } from "clsx";
import {
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type CSSProperties,
    type HTMLAttributes,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
    type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes } from "@refineui/tokens";
import { componentSizes } from "../../componentSizes";
import { WebIcon } from "../../WebIcon";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Button, type ButtonProps } from "../Button";

const PANEL_MS = 320;
const SCRIM_MS = 280;
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

type DrawerPlacement = "left" | "right";
type DrawerSize = "small" | "medium" | "large";

type DrawerContextValue = {
    open: boolean;
    setOpen: (next: boolean) => void;
    placement: DrawerPlacement;
    size: DrawerSize;
    titleId: string;
    descriptionId: string;
    panelRef: RefObject<HTMLDivElement>;
    hasTitle: boolean;
    setHasTitle: (v: boolean) => void;
    hasDescription: boolean;
    setHasDescription: (v: boolean) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(component: string): DrawerContextValue {
    const ctx = useContext(DrawerContext);
    if (!ctx) throw new Error(`${component} must be used within <Drawer>`);
    return ctx;
}

function useDrawerOpenState(
    openProp: boolean | undefined,
    defaultOpen: boolean | undefined,
    onOpenChange: ((open: boolean) => void) | undefined,
): [boolean, (next: boolean) => void] {
    const [internalOpen, setInternalOpen] = useState(!!defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? !!openProp : internalOpen;
    const setOpen = useCallback(
        (next: boolean) => {
            if (!isControlled) setInternalOpen(next);
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
    );
    return [open, setOpen];
}

export interface DrawerProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    placement?: DrawerPlacement;
    /** Web Kit Overlay `635:1756` — `componentSizes.drawerWidthSm` / `Md` / `Lg` */
    size?: DrawerSize;
    children: ReactNode;
}

function widthToken(s: DrawerSize): string {
    switch (s) {
        case "medium":
            return componentSizes.drawerWidthMd;
        case "large":
            return componentSizes.drawerWidthLg;
        default:
            return componentSizes.drawerWidthSm;
    }
}

export function Drawer({
    open: openProp,
    defaultOpen,
    onOpenChange,
    placement = "right",
    size = "small",
    children,
}: DrawerProps) {
    const [open, setOpen] = useDrawerOpenState(openProp, defaultOpen, onOpenChange);
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const [hasTitle, setHasTitle] = useState(false);
    const [hasDescription, setHasDescription] = useState(false);

    const value = useMemo(
        () => ({
            open,
            setOpen,
            placement,
            size,
            titleId,
            descriptionId,
            panelRef,
            hasTitle,
            setHasTitle,
            hasDescription,
            setHasDescription,
        }),
        [
            open,
            setOpen,
            placement,
            size,
            titleId,
            descriptionId,
            hasTitle,
            hasDescription,
        ],
    );

    return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export type DrawerTriggerProps = ButtonProps;

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(function DrawerTrigger(
    { onClick, ...props },
    ref,
) {
    const { setOpen } = useDrawerContext("DrawerTrigger");
    return (
        <Button
            ref={ref}
            {...props}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) setOpen(true);
            }}
        />
    );
});

export interface DrawerContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    container?: Element | DocumentFragment | null;
    style?: CSSProperties;
    placement?: DrawerPlacement;
    size?: DrawerSize;
}

/** Web Kit COMPONENT_SET `Drawer` `635:1756` — Overlay; 색·폭·그림자 토큰 기준. */
export function DrawerContent({
    className,
    style,
    container,
    children,
    placement: placementProp,
    size: sizeProp,
    ...props
}: DrawerContentProps) {
    const {
        open,
        setOpen,
        placement: ctxPlacement,
        size: ctxSize,
        titleId,
        descriptionId,
        panelRef,
        hasTitle,
        hasDescription,
    } = useDrawerContext("DrawerContent");
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
        const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [rendering, entered, setOpen]);

    if (!rendering) return null;
    if (typeof document === "undefined") return null;

    const placement = placementProp ?? ctxPlacement;
    const size = sizeProp ?? ctxSize;
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

    const target = container ?? document.body;

    const root = (
        <div
            data-refineui="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
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
                    backgroundColor: "var(--refineui-color-alias-surface-overlay)",
                    opacity: entered ? 1 : 0,
                    transition: `opacity ${SCRIM_MS}ms ${EASING}`,
                    pointerEvents: entered ? "auto" : "none",
                }}
                onClick={() => setOpen(false)}
                aria-hidden
            />
            <div
                ref={panelRef}
                tabIndex={-1}
                className="relative box-border flex h-full flex-col overflow-hidden bg-refineui-alias-background-primary shadow-refineui-16light outline-none"
                style={{ ...panelMotion, ...style }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );

    return createPortal(root, target);
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
    showClose?: boolean;
    actions?: ReactNode;
}

export function DrawerHeader({
    className,
    children,
    showClose = true,
    actions,
    ...props
}: DrawerHeaderProps) {
    return (
        <div
            data-name="Drawer / Header"
            className={clsx(
                "flex shrink-0 items-start gap-refineui-size-small px-refineui-size-xxlarge pb-refineui-size-medium pt-refineui-size-xxlarge",
                className,
            )}
            {...props}
        >
            <div className="flex min-h-0 min-w-0 flex-1 items-center gap-refineui-size-small">
                {showClose ? <DrawerClose /> : null}
                <div className="flex min-w-0 flex-1 flex-col gap-refineui-size-xxsmall">{children}</div>
            </div>
            {actions ? (
                <div className="flex shrink-0 items-center gap-refineui-size-small">{actions}</div>
            ) : null}
        </div>
    );
}

export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function DrawerTitle({ className, id, children, ...props }: DrawerTitleProps) {
    const { titleId, setHasTitle } = useDrawerContext("DrawerTitle");
    useEffect(() => {
        setHasTitle(true);
        return () => setHasTitle(false);
    }, [setHasTitle]);
    return (
        <h2
            id={id ?? titleId}
            className={clsx("refineui-typo-sub-title-1 m-0 min-w-0 text-refineui-alias-foreground-primary", className)}
            {...props}
        >
            {children}
        </h2>
    );
}

export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function DrawerDescription({ className, id, children, ...props }: DrawerDescriptionProps) {
    const { descriptionId, setHasDescription } = useDrawerContext("DrawerDescription");
    useEffect(() => {
        setHasDescription(true);
        return () => setHasDescription(false);
    }, [setHasDescription]);
    return (
        <p
            id={id ?? descriptionId}
            className={clsx("refineui-typo-body-4 m-0 min-w-0 text-refineui-alias-foreground-secondary", className)}
            {...props}
        >
            {children}
        </p>
    );
}

export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;

export function DrawerBody({ className, ...props }: DrawerBodyProps) {
    return (
        <div
            data-name="Body"
            className={clsx(
                "refineui-typo-body-2 box-border min-h-0 flex-1 overflow-auto border-t-refineui-thin border-t-refineui-alias-border-default p-refineui-size-xxlarge text-refineui-alias-foreground-primary",
                className,
            )}
            {...props}
        />
    );
}

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
    return (
        <div
            data-name="Drawer / Footer"
            className={clsx(
                "mt-auto flex shrink-0 items-center justify-end gap-refineui-size-small border-t-refineui-thin border-t-refineui-alias-border-default px-refineui-size-xxlarge py-refineui-size-medium",
                className,
            )}
            {...props}
        />
    );
}

export interface DrawerCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
}

export function DrawerClose({ children, onClick, className, type = "button", ...props }: DrawerCloseProps) {
    const { setOpen } = useDrawerContext("DrawerClose");
    const handleClick = (e: MouseEvent<HTMLElement>) => {
        onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
        if (!e.defaultPrevented) setOpen(false);
    };

    if (isValidElement(children)) {
        const child = children as ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>;
        return cloneElement(child, {
            ...child.props,
            onClick: (e: MouseEvent<HTMLElement>) => {
                child.props.onClick?.(e);
                handleClick(e);
            },
        });
    }

    return (
        <Button
            {...props}
            type={type}
            variant="ghost"
            size="sm"
            layout="icon"
            aria-label="닫기"
            className={className}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) setOpen(false);
            }}
        >
            <WebIcon name="dismiss" size={iconSizes.xlarge} color="currentColor" iconStyle="regular" aria-hidden />
        </Button>
    );
}

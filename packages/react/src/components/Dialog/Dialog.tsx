import { clsx } from "clsx";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
    type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes, semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Button } from "../Button";
import { dialogStyles } from "./style";
import { ScrollAreaRegion } from "../ScrollArea/ScrollAreaRegion";
import type {
    DialogCloseProps,
    DialogContentProps,
    DialogDescriptionProps,
    DialogHeaderProps,
    DialogProps,
    DialogSize,
    DialogTitleProps,
    DialogTriggerProps,
} from "./types";

/** Web Kit COMPONENT_SET `Dialog` `393:1181` */
const PANEL_MS = motionMsToNumber(semanticInteraction.duration.panel);
const SCRIM_MS = motionMsToNumber(semanticInteraction.duration.overlay);
const EASING = semanticInteraction.easing.panel;

type DialogContextValue = {
    open: boolean;
    setOpen: (next: boolean) => void;
    size: DialogSize;
    titleId: string;
    descriptionId: string;
    panelRef: RefObject<HTMLDivElement>;
    hasTitle: boolean;
    setHasTitle: (v: boolean) => void;
    hasDescription: boolean;
    setHasDescription: (v: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(component: string): DialogContextValue {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error(`${component} must be used within <Dialog>`);
    return ctx;
}

function useDialogOpenState(
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

export function Dialog({ open: openProp, defaultOpen, onOpenChange, size = "lg", children }: DialogProps) {
    const [open, setOpen] = useDialogOpenState(openProp, defaultOpen, onOpenChange);
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const [hasTitle, setHasTitle] = useState(false);
    const [hasDescription, setHasDescription] = useState(false);

    const value = useMemo(
        () => ({
            open,
            setOpen,
            size,
            titleId,
            descriptionId,
            panelRef,
            hasTitle,
            setHasTitle,
            hasDescription,
            setHasDescription,
        }),
        [open, setOpen, size, titleId, descriptionId, hasTitle, hasDescription],
    );

    return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(function DialogTrigger(
    { onClick, ...props },
    ref,
) {
    const { setOpen } = useDialogContext("DialogTrigger");
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

export function DialogContent({ className, style, container, scrollable = true, children, ...props }: DialogContentProps) {
    const { open, setOpen, size, titleId, descriptionId, panelRef, hasTitle, hasDescription } =
        useDialogContext("DialogContent");
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

    if (!rendering || typeof document === "undefined") return null;

    const target = container ?? document.body;

    const panelMotion: CSSProperties = {
        opacity: entered ? 1 : 0,
        transform: entered
            ? "scale(1) translateY(0)"
            : "scale(var(--refineui-motion-scale-enter)) translateY(var(--refineui-spacing-size-small))",
        transition: `opacity ${PANEL_MS}ms ${EASING}, transform ${PANEL_MS}ms ${EASING}`,
        willChange: "opacity, transform",
        maxWidth: size === "lg" ? componentSizes.dialogMaxWidth : componentSizes.dialogWidthSm,
    };

    const panelBody = scrollable ? (
        <ScrollAreaRegion
            type="hover"
            className={dialogStyles.panelScrollWrap}
            viewportClassName="flex min-h-0 min-w-0 flex-1 flex-col gap-refineui-size-large"
        >
            {children}
        </ScrollAreaRegion>
    ) : (
        children
    );

    const root = (
        <div
            data-refineui="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
            className={clsx(
                dialogStyles.root,
                className,
            )}
            {...props}
        >
            <div
                role="presentation"
                className={dialogStyles.scrim}
                style={{
                    backgroundColor: resolveColorTokenValue(componentColorTokens.dialog.overlay),
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
                className={dialogStyles.panel}
                style={{ ...panelMotion, ...style }}
                onClick={(e) => e.stopPropagation()}
            >
                {panelBody}
            </div>
        </div>
    );

    return createPortal(root, target);
}

export function DialogHeader({ className, children, showClose = true, ...props }: DialogHeaderProps) {
    return (
        <div
            className={clsx(dialogStyles.header, className)}
            {...props}
        >
            <div className={dialogStyles.headerMain}>{children}</div>
            {showClose ? <DialogClose /> : null}
        </div>
    );
}

export function DialogTitle({ className, id, children, ...props }: DialogTitleProps) {
    const { titleId, setHasTitle } = useDialogContext("DialogTitle");
    useEffect(() => {
        setHasTitle(true);
        return () => setHasTitle(false);
    }, [setHasTitle]);
    return (
        <h2
            id={id ?? titleId}
            className={clsx(dialogStyles.title, className)}
            {...props}
        >
            {children}
        </h2>
    );
}

export function DialogDescription({ className, id, children, ...props }: DialogDescriptionProps) {
    const { descriptionId, setHasDescription } = useDialogContext("DialogDescription");
    useEffect(() => {
        setHasDescription(true);
        return () => setHasDescription(false);
    }, [setHasDescription]);
    return (
        <p
            id={id ?? descriptionId}
            className={clsx(dialogStyles.description, className)}
            {...props}
        >
            {children}
        </p>
    );
}

export function DialogClose({ className, onClick, type = "button", ...props }: DialogCloseProps) {
    const { setOpen } = useDialogContext("DialogClose");
    return (
        <Button
            {...props}
            type={type}
            variant="ghost"
            size="sm"
            layout="icon"
            aria-label="Close"
            className={className}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) setOpen(false);
            }}
        >
            <WebIcon name="dismiss" size={iconSizes.small} color="currentColor" iconStyle="regular" aria-hidden />
        </Button>
    );
}

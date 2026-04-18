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
    type ButtonHTMLAttributes,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
    type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Button, type ButtonProps } from "../Button";

/** Web Kit COMPONENT_SET `Dialog` `393:1181` */
const PANEL_MS = 320;
const SCRIM_MS = 280;
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

type DialogSize = "lg" | "sm";

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

export interface DialogProps {
    /** 제어 모드 — `onOpenChange`와 함께 사용 */
    open?: boolean;
    /** 비제어 모드 초기값 */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Web Kit `size`: Large(600px) / Small(300px) */
    size?: DialogSize;
    children: ReactNode;
}

/**
 * 루트 — `DialogTrigger`(내부 `Button`) + `DialogContent` 조합.
 * 제어: `open` + `onOpenChange`, 비제어: `defaultOpen` + Trigger.
 */
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

export type DialogTriggerProps = ButtonProps;

/** 모달을 연다. Web Kit `Button`과 동일한 `variant`·`size` 등을 받는다. */
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

export interface DialogContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** 포털 루트 (기본 `document.body`) */
    container?: Element | DocumentFragment | null;
    style?: CSSProperties;
}

/**
 * 스크rim + 패널 포털. `open`이 false면 언마운트 전환 후 제거.
 * 자식으로 `DialogHeader` / 본문 등을 둔다.
 */
export function DialogContent({ className, style, container, children, ...props }: DialogContentProps) {
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
            : "scale(var(--refineui-motion-dialog-enter-scale)) translateY(var(--refineui-spacing-size-350))",
        transition: `opacity ${PANEL_MS}ms ${EASING}, transform ${PANEL_MS}ms ${EASING}`,
        willChange: "opacity, transform",
        maxWidth: size === "lg" ? componentSizes.dialogMaxWidth : componentSizes.dialogWidthSm,
    };

    const root = (
        <div
            data-refineui="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
            className={clsx(
                "fixed inset-0 z-refineui-messages flex items-center justify-center p-refineui-size-large",
                className,
            )}
            {...props}
        >
            <div
                role="presentation"
                className="absolute inset-0 cursor-pointer transition-opacity"
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
                className="relative box-border flex max-h-refineui-dialog-max-height-viewport w-full flex-col overflow-hidden rounded-refineui-large bg-refineui-alias-background-primary p-refineui-size-xxlarge shadow-refineui-8light outline-none"
                style={{ ...panelMotion, ...style }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-refineui-size-large overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(root, target);
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** 기본 `true` — Web Kit 헤더 닫기 */
    showClose?: boolean;
}

/** 제목·설명 열 + 닫기(`DialogClose`) */
export function DialogHeader({ className, children, showClose = true, ...props }: DialogHeaderProps) {
    return (
        <div
            className={clsx("flex shrink-0 items-start justify-between gap-refineui-size-small", className)}
            {...props}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-refineui-size-small">{children}</div>
            {showClose ? <DialogClose /> : null}
        </div>
    );
}

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function DialogTitle({ className, id, children, ...props }: DialogTitleProps) {
    const { titleId, setHasTitle } = useDialogContext("DialogTitle");
    useEffect(() => {
        setHasTitle(true);
        return () => setHasTitle(false);
    }, [setHasTitle]);
    return (
        <h2
            id={id ?? titleId}
            className={clsx("refineui-typo-sub-title-2 m-0 min-w-0 text-refineui-alias-foreground-primary", className)}
            {...props}
        >
            {children}
        </h2>
    );
}

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function DialogDescription({ className, id, children, ...props }: DialogDescriptionProps) {
    const { descriptionId, setHasDescription } = useDialogContext("DialogDescription");
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

export type DialogCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** 닫기 — Web Kit Ghost · Small · Icon + dismiss */
export function DialogClose({ className, onClick, type = "button", ...props }: DialogCloseProps) {
    const { setOpen } = useDialogContext("DialogClose");
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
            <WebIcon name="dismiss" size={iconSizes.small} color="currentColor" iconStyle="regular" aria-hidden />
        </Button>
    );
}

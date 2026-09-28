import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useId,
    useMemo,
    useState,
    type MouseEvent,
    type ReactNode,
} from "react";
import { Slot } from "@refineui/utilities/react";
import { Button, type ButtonProps } from "../Button";

type SidebarContextValue = {
    open: boolean;
    sidebarId: string;
    toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext(component: string): SidebarContextValue {
    const value = useContext(SidebarContext);
    if (!value) throw new Error(`${component} must be used within <SidebarProvider>.`);
    return value;
}

export function useSidebar(): SidebarContextValue {
    return useSidebarContext("useSidebar");
}

export interface SidebarProviderProps {
    /** Expanded sidebar. Omit to let the provider own the state. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Id of the docked sidebar element (`aria-controls`). */
    id?: string;
    children?: ReactNode;
}

/** Owns expanded state for a sidebar and a trigger placed anywhere inside. */
export function SidebarProvider({
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    id,
    children,
}: SidebarProviderProps) {
    const [uncontrolled, setUncontrolled] = useState(defaultOpen);
    const open = openProp ?? uncontrolled;
    const generatedId = useId();
    const sidebarId = id ?? generatedId;

    const toggle = useCallback(() => {
        const next = !open;
        if (openProp === undefined) setUncontrolled(next);
        onOpenChange?.(next);
    }, [onOpenChange, open, openProp]);

    const value = useMemo(
        () => ({ open, sidebarId, toggle }),
        [open, sidebarId, toggle],
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export interface SidebarTriggerProps extends ButtonProps {
    asChild?: boolean;
}

/** Button that toggles the provider. Place it wherever the control should sit. Default variant is `secondary`. */
export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(function SidebarTrigger(
    {
        asChild = false,
        onClick,
        className,
        children,
        variant = "secondary",
        size,
        layout,
        fullWidth,
        type = "button",
        ...props
    },
    ref,
) {
    const { open, toggle, sidebarId } = useSidebarContext("SidebarTrigger");
    const shared = {
        ...props,
        ref,
        "aria-expanded": open,
        "aria-controls": sidebarId,
        "data-state": open ? ("open" as const) : ("closed" as const),
        className,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);
            if (!event.defaultPrevented) toggle();
        },
    };

    if (asChild) return <Slot {...shared}>{children}</Slot>;

    return (
        <Button
            {...shared}
            type={type}
            variant={variant}
            size={size}
            layout={layout}
            fullWidth={fullWidth}
        >
            {children}
        </Button>
    );
});

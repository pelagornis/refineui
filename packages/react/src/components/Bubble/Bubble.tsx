import { clsx } from "clsx";
import {
    Children,
    createContext,
    isValidElement,
    useContext,
    type CSSProperties,
    type ReactElement,
    type ReactNode,
} from "react";
import {
    BUBBLE_MAX_WIDTH,
    bubbleContentVariantClass,
    bubbleReactionsAlignClass,
    bubbleReactionsSideClass,
    bubbleRootItemsClass,
    bubbleStyles,
} from "./style";
import type {
    BubbleAlign,
    BubbleContentProps,
    BubbleGroupProps,
    BubbleProps,
    BubbleReactionsProps,
    BubbleReactionsSide,
    BubbleVariant,
} from "./types";

type BubbleContextValue = {
    variant: BubbleVariant;
    align: BubbleAlign;
};

const BubbleContext = createContext<BubbleContextValue | null>(null);

function useBubbleContext(component: string): BubbleContextValue {
    const value = useContext(BubbleContext);
    if (!value) throw new Error(`${component} must be used within Bubble.`);
    return value;
}

function isBubbleReactionsElement(
    node: ReactNode,
): node is ReactElement<BubbleReactionsProps> {
    return isValidElement(node) && node.type === BubbleReactions;
}

function partitionBubbleChildren(children: ReactNode): {
    top: ReactNode[];
    middle: ReactNode[];
    bottom: ReactNode[];
    hasTop: boolean;
    hasBottom: boolean;
} {
    const top: ReactNode[] = [];
    const middle: ReactNode[] = [];
    const bottom: ReactNode[] = [];

    Children.forEach(children, (child) => {
        if (!isBubbleReactionsElement(child)) {
            middle.push(child);
            return;
        }
        const side: BubbleReactionsSide = child.props.side ?? "bottom";
        if (side === "top") top.push(child);
        else bottom.push(child);
    });

    return {
        top,
        middle,
        bottom,
        hasTop: top.length > 0,
        hasBottom: bottom.length > 0,
    };
}

export function BubbleGroup({ className, ...props }: BubbleGroupProps) {
    return (
        <div
            data-refineui="bubble-group"
            className={clsx(bubbleStyles.group, className)}
            {...props}
        />
    );
}

export function Bubble({
    variant = "default",
    align = "start",
    className,
    style,
    children,
    ...props
}: BubbleProps) {
    const rootStyle: CSSProperties | undefined =
        variant === "ghost"
            ? style
            : { maxWidth: BUBBLE_MAX_WIDTH, ...style };

    const { top, middle, bottom, hasTop, hasBottom } = partitionBubbleChildren(children);

    return (
        <BubbleContext.Provider value={{ variant, align }}>
            <div
                data-refineui="bubble"
                data-variant={variant}
                data-align={align}
                data-has-reactions-top={hasTop ? "true" : undefined}
                data-has-reactions-bottom={hasBottom ? "true" : undefined}
                className={clsx(
                    bubbleStyles.root,
                    bubbleRootItemsClass[align],
                    className,
                )}
                style={rootStyle}
                {...props}
            >
                <div data-refineui="bubble-surface" className={bubbleStyles.surface}>
                    {middle}
                    {top}
                    {bottom}
                </div>
            </div>
        </BubbleContext.Provider>
    );
}

export function BubbleContent({ className, ...props }: BubbleContentProps) {
    const { variant } = useBubbleContext("BubbleContent");

    return (
        <div
            data-refineui="bubble-content"
            className={clsx(
                bubbleStyles.content,
                bubbleContentVariantClass[variant],
                className,
            )}
            {...props}
        />
    );
}

export function BubbleReactions({
    side = "bottom",
    align: alignProp,
    className,
    ...props
}: BubbleReactionsProps) {
    const { align: bubbleAlign } = useBubbleContext("BubbleReactions");
    /**
     * Default toward the conversation center:
     * other (start) → trailing reactions, mine (end) → leading reactions.
     */
    const align = alignProp ?? (bubbleAlign === "start" ? "end" : "start");

    return (
        <div
            data-refineui="bubble-reactions"
            data-side={side}
            data-align={align}
            className={clsx(
                bubbleStyles.reactions,
                bubbleReactionsSideClass[side],
                bubbleReactionsAlignClass[align],
                className,
            )}
            {...props}
        />
    );
}

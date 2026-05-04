import * as SelectPrimitive from "@radix-ui/react-select";
import { clsx } from "clsx";
import { Children, createContext, forwardRef, isValidElement, useContext, useMemo, type ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import { componentSizes, foundationSizes } from "../../componentSizes";
import { WebIcon } from "../../WebIcon";
import { selectSizeClass, selectStyles } from "./style";
import type {
    SelectArrowProps,
    SelectContentProps,
    SelectGroupProps,
    SelectIconProps,
    SelectItemIndicatorProps,
    SelectItemProps,
    SelectItemTextProps,
    SelectLabelProps,
    SelectPortalProps,
    SelectProps,
    SelectScrollDownButtonProps,
    SelectScrollUpButtonProps,
    SelectSectionProps,
    SelectSeparatorProps,
    SelectTriggerProps,
    SelectValueProps,
    SelectViewportProps,
} from "./types";

function parsePx(px: string, fallback: number) {
    const n = Number.parseFloat(px);
    return Number.isFinite(n) ? n : fallback;
}

/** @radix-ui/react-select Content `sideOffset` — Themes `4px`에 맞춤 (`foundationSize40`) */
const SIDE_OFFSET = parsePx(foundationSizes.foundationSize40, 4);

type SelectSizeFull = "sm" | "md" | "lg";

const SelectPlaceholderContext = createContext<string | undefined>(undefined);

const SelectSizeContext = createContext<{ size: SelectSizeFull; fullWidth: boolean }>({
    size: "md",
    fullWidth: false,
});

/** `SelectContent`의 `position` — Viewport 스타일(목록 높이 맞춤 vs 래퍼 채움) 분기 */
const SelectContentPositionContext = createContext<"popper" | "item-aligned">("item-aligned");

function useSelectPlaceholder() {
    return useContext(SelectPlaceholderContext);
}

function useSelectSize() {
    return useContext(SelectSizeContext);
}

function useSelectContentPosition() {
    return useContext(SelectContentPositionContext);
}

export function Select(props: SelectProps) {
    const {
        placeholder,
        size = "md",
        fullWidth = false,
        children,
        value,
        defaultValue,
        onValueChange,
        open,
        defaultOpen,
        onOpenChange,
        disabled,
        name,
        required,
        form,
        dir,
        autoComplete,
        ...divProps
    } = props;

    const { className: wrapperClassName, ...wrapperRest } = divProps;

    const isControlled = value !== undefined;
    const normalizedValue = isControlled ? (value === "" ? undefined : value) : undefined;
    const normalizedDefault =
        !isControlled && (defaultValue === "" || defaultValue === undefined) ? undefined : !isControlled ? defaultValue : undefined;

    const sizeMemo = useMemo(() => ({ size, fullWidth }), [size, fullWidth]);

    return (
        <SelectPrimitive.Root
            {...(isControlled ? { value: normalizedValue } : { defaultValue: normalizedDefault })}
            onValueChange={onValueChange}
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            disabled={disabled}
            name={name}
            required={required}
            form={form}
            dir={dir}
            autoComplete={autoComplete}
        >
            <SelectPlaceholderContext.Provider value={placeholder}>
                <SelectSizeContext.Provider value={sizeMemo}>
                    <div className={clsx(selectStyles.root, fullWidth && "w-full", wrapperClassName)} {...wrapperRest}>
                        {children}
                    </div>
                </SelectSizeContext.Provider>
            </SelectPlaceholderContext.Provider>
        </SelectPrimitive.Root>
    );
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(props, forwardedRef) {
    const { className, children, style, ...triggerRest } = props;
    const { size, fullWidth } = useSelectSize();
    return (
        <SelectPrimitive.Trigger ref={forwardedRef} asChild {...triggerRest}>
            <button
                type="button"
                className={clsx(
                    "data-[placeholder]:[&_[data-refineui-select-value]]:text-refineui-alias-foreground-placeholder",
                    selectStyles.trigger,
                    selectSizeClass[size],
                    fullWidth && "w-full",
                    className,
                )}
                style={{ minWidth: componentSizes.dropdownMenuWidth, ...style }}
            >
                <span className={selectStyles.triggerInner}>{children}</span>
                <WebIcon name="chevron-down" size={iconSizes.xsmall} aria-hidden />
            </button>
        </SelectPrimitive.Trigger>
    );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(function SelectValue(
    { placeholder, className, ...props },
    forwardedRef,
) {
    const rootPlaceholder = useSelectPlaceholder();
    return (
        <SelectPrimitive.Value
            ref={forwardedRef}
            data-refineui-select-value=""
            placeholder={placeholder ?? rootPlaceholder ?? "Select..."}
            className={clsx(selectStyles.value, className)}
            {...props}
        />
    );
});
SelectValue.displayName = "SelectValue";

export const SelectIcon = forwardRef<HTMLSpanElement, SelectIconProps>(function SelectIcon(
    { className, children, ...props },
    forwardedRef,
) {
    return (
        <SelectPrimitive.Icon ref={forwardedRef} asChild {...props}>
            <span className={clsx(selectStyles.iconWrap, className)}>{children ?? <WebIcon name="chevron-down" size={iconSizes.xsmall} />}</span>
        </SelectPrimitive.Icon>
    );
});
SelectIcon.displayName = "SelectIcon";

export function SelectPortal({ children, container }: SelectPortalProps) {
    return <SelectPrimitive.Portal container={container ?? undefined}>{children}</SelectPrimitive.Portal>;
}

/** 기본 `position`은 `item-aligned`(트리거·항목 텍스트 정렬). 목록 높이에 맞춘 컴팩트 패널은 `position="popper"`. */
export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(
    { className, children, position = "item-aligned", ...props },
    forwardedRef,
) {
    const normalizedChildren = (() => {
        const flat = Children.toArray(children);
        if (flat.length === 1 && isValidElement(flat[0]) && flat[0].type === SelectViewport) {
            return children as ReactNode;
        }
        return <SelectViewport>{children}</SelectViewport>;
    })();

    const isPopper = position === "popper";

    return (
        <SelectContentPositionContext.Provider value={position}>
            <SelectPrimitive.Content
                ref={forwardedRef}
                position={position}
                sideOffset={SIDE_OFFSET}
                className={clsx(
                    selectStyles.positioner,
                    selectStyles.contentShell,
                    isPopper ? selectStyles.contentPopper : selectStyles.contentItemAligned,
                    className,
                )}
                {...props}
            >
                <div className={isPopper ? selectStyles.scrollAreaRootPopper : selectStyles.scrollAreaRootItemAligned}>
                    {normalizedChildren}
                </div>
            </SelectPrimitive.Content>
        </SelectContentPositionContext.Provider>
    );
});
SelectContent.displayName = "SelectContent";

export const SelectViewport = forwardRef<HTMLDivElement, SelectViewportProps>(function SelectViewport(
    { className, ...props },
    forwardedRef,
) {
    const position = useSelectContentPosition();
    const viewportStyle = position === "popper" ? selectStyles.viewportPopper : selectStyles.viewportItemAligned;
    return <SelectPrimitive.Viewport ref={forwardedRef} className={clsx(viewportStyle, className)} {...props} />;
});
SelectViewport.displayName = "SelectViewport";

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup({ className, ...props }, forwardedRef) {
    return <SelectPrimitive.Group ref={forwardedRef} className={clsx(selectStyles.group, className)} {...props} />;
});
SelectGroup.displayName = "SelectGroup";

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(function SelectLabel({ className, ...props }, forwardedRef) {
    return <SelectPrimitive.Label ref={forwardedRef} className={clsx(selectStyles.label, className)} {...props} />;
});
SelectLabel.displayName = "SelectLabel";

export function SelectSection({ children, className, ...props }: SelectSectionProps) {
    return (
        <div className={clsx(selectStyles.label, className)} {...props}>
            {children}
        </div>
    );
}

export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(function SelectSeparator(
    { className, ...props },
    forwardedRef,
) {
    return <SelectPrimitive.Separator ref={forwardedRef} className={clsx(selectStyles.separator, className)} {...props} />;
});
SelectSeparator.displayName = "SelectSeparator";

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
    { value: itemValue, children, disabled, textValue, className, ...props },
    forwardedRef,
) {
    return (
        <SelectPrimitive.Item
            ref={forwardedRef}
            value={itemValue}
            disabled={disabled}
            textValue={textValue}
            className={clsx(selectStyles.item, className)}
            {...props}
        >
            <SelectPrimitive.ItemIndicator className={selectStyles.itemIndicator}>
                <WebIcon name="checkmark" size={iconSizes.xsmall} aria-hidden />
            </SelectPrimitive.ItemIndicator>
            <SelectPrimitive.ItemText className={selectStyles.itemText}>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
});
SelectItem.displayName = "SelectItem";

export const SelectItemText = forwardRef<HTMLSpanElement, SelectItemTextProps>(function SelectItemText(
    { className, ...props },
    forwardedRef,
) {
    return <SelectPrimitive.ItemText ref={forwardedRef} className={clsx(selectStyles.itemText, className)} {...props} />;
});
SelectItemText.displayName = "SelectItemText";

export const SelectItemIndicator = forwardRef<HTMLSpanElement, SelectItemIndicatorProps>(function SelectItemIndicator(
    { className, children, ...props },
    forwardedRef,
) {
    return (
        <SelectPrimitive.ItemIndicator ref={forwardedRef} className={clsx(selectStyles.itemIndicator, className)} {...props}>
            {children ?? <WebIcon name="checkmark" size={iconSizes.xsmall} aria-hidden />}
        </SelectPrimitive.ItemIndicator>
    );
});
SelectItemIndicator.displayName = "SelectItemIndicator";

export const SelectScrollUpButton = forwardRef<HTMLDivElement, SelectScrollUpButtonProps>(function SelectScrollUpButton(
    { className, ...props },
    forwardedRef,
) {
    return <SelectPrimitive.ScrollUpButton ref={forwardedRef} className={className} {...props} />;
});
SelectScrollUpButton.displayName = "SelectScrollUpButton";

export const SelectScrollDownButton = forwardRef<HTMLDivElement, SelectScrollDownButtonProps>(function SelectScrollDownButton(
    { className, ...props },
    forwardedRef,
) {
    return <SelectPrimitive.ScrollDownButton ref={forwardedRef} className={className} {...props} />;
});
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export const SelectArrow = forwardRef<SVGSVGElement, SelectArrowProps>(function SelectArrow({ className, ...props }, forwardedRef) {
    return <SelectPrimitive.Arrow ref={forwardedRef} className={className} {...props} />;
});
SelectArrow.displayName = "SelectArrow";

export {
    Select as Root,
    SelectTrigger as Trigger,
    SelectValue as Value,
    SelectIcon as Icon,
    SelectPortal as Portal,
    SelectContent as Content,
    SelectViewport as Viewport,
    SelectGroup as Group,
    SelectLabel as Label,
    SelectItem as Item,
    SelectItemText as ItemText,
    SelectItemIndicator as ItemIndicator,
    SelectScrollUpButton as ScrollUpButton,
    SelectScrollDownButton as ScrollDownButton,
    SelectSeparator as Separator,
    SelectArrow as Arrow,
};

import type { HTMLAttributes, ReactNode } from "react";
import type {
    SelectArrowProps as RadixSelectArrowProps,
    SelectContentProps as RadixSelectContentProps,
    SelectGroupProps as RadixSelectGroupProps,
    SelectIconProps as RadixSelectIconProps,
    SelectItemIndicatorProps as RadixSelectItemIndicatorProps,
    SelectItemProps as RadixSelectItemProps,
    SelectItemTextProps as RadixSelectItemTextProps,
    SelectLabelProps as RadixSelectLabelProps,
    SelectProps as RadixSelectRootProps,
    SelectScrollDownButtonProps as RadixSelectScrollDownButtonProps,
    SelectScrollUpButtonProps as RadixSelectScrollUpButtonProps,
    SelectSeparatorProps as RadixSelectSeparatorProps,
    SelectTriggerProps as RadixSelectTriggerProps,
    SelectValueProps as RadixSelectValueProps,
    SelectViewportProps as RadixSelectViewportProps,
} from "@radix-ui/react-select";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
    textValue?: string;
}

/** `@radix-ui/react-select` Root + RefineUI 레이아웃·토큰 옵션 (`className` 등 나머지는 래퍼 `div`) */
export interface SelectProps
    extends RadixSelectRootProps,
        Omit<HTMLAttributes<HTMLDivElement>, keyof RadixSelectRootProps | "children"> {
    /** 미선택 시 `SelectValue` 기본 placeholder */
    placeholder?: string;
    size?: SelectSize;
    fullWidth?: boolean;
}

export type SelectTriggerProps = RadixSelectTriggerProps;

export type SelectValueProps = RadixSelectValueProps;

export type SelectIconProps = RadixSelectIconProps;

export type SelectContentProps = RadixSelectContentProps;

export type SelectViewportProps = RadixSelectViewportProps;

export type SelectGroupProps = RadixSelectGroupProps;

export type SelectLabelProps = RadixSelectLabelProps;

export type SelectSeparatorProps = RadixSelectSeparatorProps;

export type SelectItemProps = RadixSelectItemProps;

export type SelectItemTextProps = RadixSelectItemTextProps;

export type SelectItemIndicatorProps = RadixSelectItemIndicatorProps;

export type SelectArrowProps = RadixSelectArrowProps;

export type SelectScrollUpButtonProps = RadixSelectScrollUpButtonProps;

export type SelectScrollDownButtonProps = RadixSelectScrollDownButtonProps;

export type SelectPortalProps = {
    children?: ReactNode;
    /** `Select.Content`를 포털할 컨테이너 (기본 `document.body`) */
    container?: HTMLElement | null;
};

export type SelectSectionProps = HTMLAttributes<HTMLDivElement>;

export interface SelectItemRegistration {
    value: string;
    disabled: boolean;
    label: string;
    textValue?: string;
    nodeId?: string;
}

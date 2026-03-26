import type { HTMLAttributes, ReactNode } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";

export type AlertVariant = "default" | "info" | "success" | "warning" | "danger" | "custom";

export interface AlertAction {
    label: string;
    onClick?: () => void;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: AlertVariant;
    /**
     * 왼쪽 아이콘 영역.
     * - `string`: RefineUI System Icons 글리프 이름 (`WebIcon`으로 렌더)
     * - `ReactNode`: 임의 노드 (예: `<WebIcon name="..." />`)
     * - 생략 시 variant별 기본 아이콘
     */
    icon?: string | ReactNode;
    /** Alert 제목 */
    title?: ReactNode;
    /** Alert 설명 (title 아래) */
    description?: ReactNode;
    /** 닫기 버튼 클릭 시 */
    onClose?: () => void;
    /** 액션 버튼들 (최대 2개 권장) */
    actions?: AlertAction[];
    /** children이 있으면 title/description 대신 렌더 */
    children?: ReactNode;
}

/**
 * Web Kit Alert — Figma MCP `Alert` (Pelagornis RefineUI Web Kit)
 * 레이아웃: 1행 = 아이콘(24) + 텍스트 + 닫기, 2행 = 액션(우측 정렬, gap medium)
 */
const variantTitleColor: Record<AlertVariant, string> = {
    default: colors.primaryBlack,
    info: colors.blue700,
    success: colors.green700,
    warning: colors.yellow700,
    danger: colors.red700,
    custom: colors.purple700,
};

const variantDescriptionColor: Record<AlertVariant, string> = {
    default: colors.neutral600,
    info: colors.blue500,
    success: colors.green500,
    warning: colors.yellow300,
    danger: colors.red500,
    custom: colors.purple500,
};

const variantIconNames: Record<AlertVariant, string> = {
    default: "circle",
    info: "info",
    success: "checkmark",
    warning: "warning",
    danger: "error-circle",
    custom: "star",
};

/** 24×24 슬롯 — MCP: 내부 16×16 글리프(에셋과 동일 인셋), CSS 링 없음 */
function AlertIconSlot({ children }: { children: ReactNode }) {
    return (
        <div
            data-refineui="alert-icon-slot"
            style={{
                width: spacings.sizeXXLarge,
                height: spacings.sizeXXLarge,
                minWidth: spacings.sizeXXLarge,
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {children}
        </div>
    );
}

function AlertSystemGlyph({ name, color }: { name: string; color: string }) {
    return <WebIcon name={name} size={iconSizes.md} color={color} fallback="●" aria-hidden />;
}

export function Alert({
    variant = "info",
    icon,
    title,
    description,
    onClose,
    actions,
    children,
    style,
    ...props
}: AlertProps) {
    const titleColor = variantTitleColor[variant];
    const descriptionColor = variantDescriptionColor[variant];
    const defaultIconName = variantIconNames[variant];

    const leading =
        icon === undefined || icon === null ? (
            <AlertIconSlot>
                <AlertSystemGlyph name={defaultIconName} color={titleColor} />
            </AlertIconSlot>
        ) : typeof icon === "string" ? (
            <AlertIconSlot>
                <AlertSystemGlyph name={icon.length > 0 ? icon : defaultIconName} color={titleColor} />
            </AlertIconSlot>
        ) : (
            <AlertIconSlot>{icon}</AlertIconSlot>
        );

    const body =
        title != null || description != null ? (
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: spacings.sizeXSmall }}>
                {title && (
                    <div style={{ ...typographys.caption1, color: titleColor }}>{title}</div>
                )}
                {description && (
                    <div style={{ ...typographys.caption2, color: descriptionColor }}>{description}</div>
                )}
            </div>
        ) : (
            <div style={{ flex: 1, minWidth: 0, ...typographys.body2, color: colors.primaryBlack }}>{children}</div>
        );

    const closeBtn =
        onClose != null ? (
            <button
                type="button"
                data-refineui="alert-close"
                aria-label="닫기"
                onClick={onClose}
                style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    color: colors.neutral600,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: spacings.sizeLarge,
                    height: spacings.sizeLarge,
                    minWidth: spacings.sizeLarge,
                    flexShrink: 0,
                    lineHeight: 1,
                }}
            >
                <WebIcon name="dismiss" size={iconSizes.sm} color="currentColor" fallback="×" />
            </button>
        ) : null;

    const actionRow =
        actions && actions.length > 0 ? (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: spacings.sizeMedium,
                    flexWrap: "wrap",
                    width: "100%",
                }}
            >
                {actions.slice(0, 2).map((action, i) => (
                    <Button key={i} variant="primary" size="sm" onClick={action.onClick}>
                        {action.label}
                    </Button>
                ))}
            </div>
        ) : null;

    return (
        <div
            data-refineui="alert"
            role="alert"
            style={{
                display: "flex",
                alignItems: "flex-start",
                padding: `${spacings.sizeMedium} ${spacings.sizeLarge}`,
                borderRadius: borderRadii.roundedLarge,
                backgroundColor: colors.neutralWhite,
                border: `${strokeWidths.strokeWidthHairline} solid ${colors.neutral300}`,
                boxSizing: "border-box",
                ...style,
            }}
            {...props}
        >
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: spacings.sizeMedium,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: spacings.sizeMedium,
                        width: "100%",
                    }}
                >
                    {leading}
                    {body}
                    {closeBtn}
                </div>
                {actionRow}
            </div>
        </div>
    );
}

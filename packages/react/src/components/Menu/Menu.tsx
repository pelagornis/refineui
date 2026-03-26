import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useCallback, useRef } from "react";
import { colors, spacings, borderRadii, typographys, shadows, toBoxShadow, strokeWidths, sizes } from "@refineui/tokens";

export interface MenuItem {
    id: string;
    label: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
    items: MenuItem[];
}

export function Menu({ items, style, ...props }: MenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    const itemButtons = useCallback((): HTMLButtonElement[] => {
        const nodelist = menuRef.current?.querySelectorAll<HTMLButtonElement>('[data-refineui="menu-item"]');
        return nodelist ? Array.from(nodelist) : [];
    }, []);

    const focusAdjacent = useCallback(
        (fromIndex: number, delta: number) => {
            const arr = itemButtons();
            const enabledIdx = arr.map((b, i) => (b.disabled ? -1 : i)).filter((i): i is number => i >= 0);
            if (enabledIdx.length === 0) return;
            const pos = enabledIdx.indexOf(fromIndex);
            if (pos < 0) return;
            const next = (pos + delta + enabledIdx.length) % enabledIdx.length;
            arr[enabledIdx[next]!]!.focus();
        },
        [itemButtons]
    );

    const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const arr = itemButtons();
        const active = document.activeElement;
        const idx = active instanceof HTMLButtonElement ? arr.indexOf(active) : -1;
        if (idx < 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                focusAdjacent(idx, 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                focusAdjacent(idx, -1);
                break;
            case "Home":
                e.preventDefault();
                for (let i = 0; i < arr.length; i++) {
                    if (!arr[i]!.disabled) {
                        arr[i]!.focus();
                        break;
                    }
                }
                break;
            case "End":
                e.preventDefault();
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (!arr[i]!.disabled) {
                        arr[i]!.focus();
                        break;
                    }
                }
                break;
            default:
                break;
        }
    };

    return (
        <div
            ref={menuRef}
            data-refineui="menu"
            role="menu"
            onKeyDown={onMenuKeyDown}
            style={{
                minWidth: sizes.menuMinWidth,
                backgroundColor: colors.neutralWhite,
                borderRadius: borderRadii.roundedMedium,
                boxShadow: toBoxShadow(shadows.shadow4Light),
                border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                padding: spacings.sizeXSmall,
                ...style,
            }}
            {...props}
        >
            {items.map((item) => (
                <button
                    key={item.id}
                    data-refineui="menu-item"
                    role="menuitem"
                    type="button"
                    disabled={item.disabled}
                    onClick={item.onClick}
                    style={{
                        width: "100%",
                        display: "block",
                        padding: `${spacings.sizeSmall} ${spacings.sizeMedium}`,
                        textAlign: "left",
                        border: "none",
                        background: "none",
                        cursor: item.disabled ? "not-allowed" : "pointer",
                        ...typographys.body3,
                        color: item.disabled ? colors.neutral500 : colors.primaryBlack,
                        borderRadius: borderRadii.roundedSmall,
                        opacity: item.disabled ? 0.6 : 1,
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}

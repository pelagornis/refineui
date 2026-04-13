import { clsx } from "clsx";
import type { HTMLAttributes, KeyboardEvent } from "react";
import { useCallback, useRef } from "react";

export interface MenuItem {
    id: string;
    label: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
    items: MenuItem[];
}

/** Web Kit COMPONENT_SET `Menu` `633:4268` — 텍스트 항목만 (섹션·아이콘·단축키 슬롯은 Figma에 있으나 React는 단순 리스트). `docs/design-specs-web-kit.md` Menu 절. */
export function Menu({ items, className, ...props }: MenuProps) {
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
        [itemButtons],
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
            className={clsx(
                "box-border flex min-w-refineui-menu-panel-width flex-col gap-refineui-size-minimal rounded-refineui-large border-refineui-hairline border-refineui-neutral-300 bg-refineui-neutral-white p-refineui-size-xsmall shadow-refineui-2light",
                className,
            )}
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
                    className={clsx(
                        "refineui-typo-body-2 block w-full rounded-refineui-large border-none bg-transparent p-refineui-size-small text-left",
                        item.disabled
                            ? "cursor-not-allowed text-refineui-neutral-500 opacity-60"
                            : "cursor-pointer text-refineui-primary-black opacity-100",
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}

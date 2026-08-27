import { useEffect, useRef, useState } from "react";
import { SegmentedControl, SegmentedControlItem } from "@refineui/react";

const MANAGERS = ["npm", "yarn", "pnpm", "bun"] as const;
type PackageManager = (typeof MANAGERS)[number];

const STORAGE_KEY = "refineui-docs-package-manager";

function isPackageManager(value: string): value is PackageManager {
    return (MANAGERS as readonly string[]).includes(value);
}

function readStoredManager(): PackageManager {
    if (typeof window === "undefined") return "npm";
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw && isPackageManager(raw) ? raw : "npm";
}

function syncPanels(root: ParentNode, manager: PackageManager) {
    root.querySelectorAll<HTMLElement>("[data-pm-panel]").forEach((panel) => {
        const match = panel.getAttribute("data-pm-panel") === manager;
        if (match) {
            panel.removeAttribute("hidden");
        } else {
            panel.setAttribute("hidden", "");
        }
    });
}

/**
 * RefineUI SegmentedControl that toggles sibling `[data-pm-panel]` blocks.
 * Markdown fences inside those panels keep Expressive Code copy.
 */
export function PackageManagerPicker() {
    const hostRef = useRef<HTMLDivElement>(null);
    const [manager, setManager] = useState<PackageManager>("npm");

    useEffect(() => {
        const next = readStoredManager();
        setManager(next);
        const root = hostRef.current?.closest("[data-docs-package-manager]");
        if (root) syncPanels(root, next);
    }, []);

    useEffect(() => {
        const root = hostRef.current?.closest("[data-docs-package-manager]");
        if (root) syncPanels(root, manager);
    }, [manager]);

    const onValueChange = (value: string) => {
        if (!isPackageManager(value)) return;
        setManager(value);
        window.localStorage.setItem(STORAGE_KEY, value);
        document.querySelectorAll("[data-docs-package-manager]").forEach((root) => {
            syncPanels(root, value);
        });
    };

    return (
        <div ref={hostRef} data-docs-pm-picker>
            <SegmentedControl
                aria-label="Package manager"
                value={manager}
                onValueChange={onValueChange}
            >
                {MANAGERS.map((item) => (
                    <SegmentedControlItem key={item} value={item}>
                        {item}
                    </SegmentedControlItem>
                ))}
            </SegmentedControl>
        </div>
    );
}

export default PackageManagerPicker;

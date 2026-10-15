import { ResizableHandle } from "@refineui/react";

export function SidebarResizeHandle({ animating, open }: { animating: boolean; open: boolean }) {
    return (
        <ResizableHandle
            withHandle
            disabled={animating || !open}
            aria-label="Resize sidebar"
            className="transition-[width,opacity] duration-[var(--refineui-motion-duration-panel)] ease-[var(--refineui-motion-easing-emphasized)]"
            style={{
                width: open ? "var(--refineui-size-foundation-size-120)" : 0,
                opacity: open ? 1 : 0,
            }}
        />
    );
}

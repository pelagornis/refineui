import { ResizableHandle } from "@refineui/react";

export function SidebarResizeHandle({ animating }: { animating: boolean }) {
    return <ResizableHandle withHandle disabled={animating} aria-label="Resize sidebar" />;
}

import type { ReactNode } from "react";
import { Look, Looks, Cluster } from "../docs-ui";

export { Look, Looks, Cluster };

interface PreviewFrameProps {
    children: ReactNode;
    title?: string;
    variant?: "light" | "dark";
}

/** Compact look for foundation token tables. Prefer `Look` on component pages. */
export default function PreviewFrame({ children, title, variant }: PreviewFrameProps) {
    return (
        <Look
            caption={title}
            align="stretch"
            tone={variant === "dark" ? "scrim" : "surface"}
            size="compact"
        >
            {children}
        </Look>
    );
}

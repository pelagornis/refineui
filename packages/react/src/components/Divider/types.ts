import type { HTMLAttributes, ReactNode } from "react";

type DividerHTML = Omit<HTMLAttributes<HTMLDivElement>, "children">;
export type DividerAlign = "center" | "left" | "right";

export type DividerProps =
    | (DividerHTML & { layout?: "default" })
    | (DividerHTML & { layout: "content"; children: ReactNode; align?: DividerAlign })
    | (DividerHTML & { layout: "icon"; align?: DividerAlign });


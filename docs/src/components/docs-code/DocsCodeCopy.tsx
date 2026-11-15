import { CodeBlockCopyButton } from "@refineui/react";

/** Hydrated island: copies the exact fence source. */
export default function DocsCodeCopy({ value }: { value: string }) {
    return <CodeBlockCopyButton value={value} />;
}

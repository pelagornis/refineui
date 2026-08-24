import type { ReactNode } from "react";
import { SpecTable } from "./SpecTable";

export type AnatomyPart = {
    name: string;
    description: string;
};

export function Anatomy({
    parts,
    preview,
}: {
    parts: AnatomyPart[];
    preview?: ReactNode;
}) {
    return (
        <div data-docs-ui="anatomy">
            {preview ? <div data-docs-ui="anatomy-preview">{preview}</div> : null}
            <SpecTable
                aria-label="Anatomy"
                columns={[
                    { key: "name", header: "Part" },
                    { key: "description", header: "Role" },
                ]}
                rows={parts.map((part) => ({
                    name: part.name,
                    description: part.description,
                }))}
            />
        </div>
    );
}

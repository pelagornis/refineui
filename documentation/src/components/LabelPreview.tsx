import { spacings } from "@refineui/tokens";
import { Input, Label, LabelRequired } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

/** Web Kit Label atom + composition with LabelRequired (Field uses the same pieces). */
export default function LabelPreview() {
    return (
        <PreviewFrame>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: spacings.sizeXXLarge,
                    width: "100%",
                    maxWidth: "360px",
                }}
            >
                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Size
                    </h4>
                    <div className="flex flex-col gap-refineui-size-small">
                        <Label htmlFor="label-sm" size="sm">
                            Small
                        </Label>
                        <Input id="label-sm" size="sm" fullWidth placeholder="sm" />
                        <Label htmlFor="label-md" size="md">
                            Medium
                        </Label>
                        <Input id="label-md" size="md" fullWidth placeholder="md" />
                        <Label htmlFor="label-lg" size="lg">
                            Large
                        </Label>
                        <Input id="label-lg" size="lg" fullWidth placeholder="lg" />
                    </div>
                </section>

                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Required
                    </h4>
                    <div className="flex flex-col gap-refineui-size-small">
                        <Label htmlFor="label-req">
                            Email
                            <LabelRequired />
                        </Label>
                        <Input id="label-req" type="email" fullWidth placeholder="name@example.com" />
                        <Label htmlFor="label-req-prop" required>
                            Via required prop
                        </Label>
                        <Input id="label-req-prop" fullWidth placeholder="same * mark" />
                    </div>
                </section>

                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Disabled
                    </h4>
                    <Label htmlFor="label-disabled" disabled>
                        Disabled label
                    </Label>
                    <Input id="label-disabled" disabled fullWidth placeholder="Disabled" />
                </section>
            </div>
        </PreviewFrame>
    );
}

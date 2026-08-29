import { Input, Label, Stack } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function LabelPreview() {
    return (
        <Looks>
            <Look>
                <Stack gap="sizeXSmall">
                    <Label htmlFor="label-preview">Email</Label>
                    <Input id="label-preview" type="email" placeholder="name@example.com" />
                </Stack>
            </Look>
        </Looks>
    );
}

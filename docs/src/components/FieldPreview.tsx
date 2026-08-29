import { Field, FieldHint, FieldLabel, Input } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function FieldPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" placeholder="email@example.com" fullWidth />
                    <FieldHint>We'll never share your email</FieldHint>
                </Field>
            </Look>
        </Looks>
    );
}

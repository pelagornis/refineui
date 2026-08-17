import { Button, Field, FieldLabel, Input, PopOver, Stack, Text } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

function DimensionFields() {
    return (
        <Stack gap="sizeLarge" className="w-full">
            <Stack gap="sizeXXSmall">
                <Text as="p" variant="bodyMd" className="m-0">
                    Dimensions
                </Text>
                <Text as="p" variant="captionLg" className="m-0 text-refineui-alias-foreground-secondary">
                    Layer size
                </Text>
            </Stack>
            <Stack gap="sizeMedium" className="w-full">
                <Field size="sm">
                    <FieldLabel>Width</FieldLabel>
                    <Input id="popover-width" size="sm" defaultValue="100%" fullWidth />
                </Field>
                <Field size="sm">
                    <FieldLabel>Height</FieldLabel>
                    <Input id="popover-height" size="sm" defaultValue="25px" fullWidth />
                </Field>
            </Stack>
        </Stack>
    );
}

export default function PopOverDemo() {
    return (
        <Looks>
            <Look>
                <PopOver
                    trigger={
                        <Button type="button" variant="secondary">
                            Open
                        </Button>
                    }
                    content={<DimensionFields />}
                />
            </Look>
        </Looks>
    );
}

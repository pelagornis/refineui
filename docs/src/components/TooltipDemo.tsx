import { Button, Tooltip } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function TooltipDemo() {
    return (
        <Looks>
            <Look>
                <Tooltip
                    delayMs={0}
                    trigger={
                        <Button type="button" variant="secondary">
                            Label
                        </Button>
                    }
                    content="Tooltip"
                />
            </Look>
        </Looks>
    );
}

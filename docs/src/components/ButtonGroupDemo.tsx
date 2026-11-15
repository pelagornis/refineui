import { iconSizes } from "@refineui/tokens";
import { Button, ButtonGroup, WebIcon } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

function Icon({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.medium} color="currentColor" aria-hidden />;
}

export default function ButtonGroupDemo() {
    return (
        <Looks>
            <Look>
                <ButtonGroup aria-label="Canvas">
                    <Button layout="icon" aria-label="Back" title="Back"><Icon name="chevron-left" /></Button>
                    <Button layout="icon" aria-label="Zoom in" title="Zoom in"><Icon name="zoom-in" /></Button>
                    <Button layout="icon" aria-label="Zoom out" title="Zoom out"><Icon name="zoom-out" /></Button>
                    <Button layout="icon" aria-label="Copy" title="Copy"><Icon name="copy" /></Button>
                    <Button layout="icon" aria-label="Cut" title="Cut"><Icon name="cut" /></Button>
                </ButtonGroup>
            </Look>
        </Looks>
    );
}

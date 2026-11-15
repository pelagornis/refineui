import { useState } from "react";
import { iconSizes } from "@refineui/tokens";
import {
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
    ToolbarDivider,
    ToolbarToggleButton,
    WebIcon,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

function Icon({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.medium} color="currentColor" aria-hidden />;
}

function Formatting() {
    const [align, setAlign] = useState("left");
    return (
        <Toolbar label="Text formatting" attached>
            <ToolbarGroup aria-label="Text style">
                <ToolbarToggleButton aria-label="Highlight" title="Highlight" defaultPressed><Icon name="highlight" /></ToolbarToggleButton>
                <ToolbarToggleButton aria-label="Link" title="Link"><Icon name="link" /></ToolbarToggleButton>
                <ToolbarToggleButton aria-label="Code" title="Code"><Icon name="code" /></ToolbarToggleButton>
            </ToolbarGroup>
            <ToolbarDivider />
            <ToolbarGroup aria-label="Alignment">
                {(["left", "center", "right"] as const).map((value) => (
                    <ToolbarToggleButton key={value} aria-label={`Align ${value}`} title={`Align ${value}`} pressed={align === value} onPressedChange={() => setAlign(value)}>
                        <Icon name={`text-align-${value}`} />
                    </ToolbarToggleButton>
                ))}
            </ToolbarGroup>
            <ToolbarDivider />
            <ToolbarGroup aria-label="Clipboard">
                <ToolbarButton aria-label="Copy" title="Copy"><Icon name="copy" /></ToolbarButton>
                <ToolbarButton aria-label="Cut" title="Cut"><Icon name="cut" /></ToolbarButton>
            </ToolbarGroup>
        </Toolbar>
    );
}

export default function ToolbarDemo() {
    return (
        <Looks>
            <Look>
                <Formatting />
            </Look>
        </Looks>
    );
}

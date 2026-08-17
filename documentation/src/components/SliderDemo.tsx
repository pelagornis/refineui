import { Slider } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function SliderDemo() {
    return (
        <Looks>
            <Look align="stretch">
                <Slider defaultValue={50} min={0} max={100} size="md" />
            </Look>
        </Looks>
    );
}

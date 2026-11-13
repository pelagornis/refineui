import { useState } from "react";
import { Stack } from "@refineui/react";
import { ControlGroup, ControlSelect, DocSection } from "../docs-ui";
import NavigationMenuPreview, { type PreviewLayout } from "./NavigationMenuPreview";

const layoutOptions = ["dropdown", "floating", "overlay"] as const satisfies readonly PreviewLayout[];

export default function NavigationMenuTokenInspector({ locale }: { locale?: "ko" }) {
    const [layout, setLayout] = useState<PreviewLayout>("dropdown");
    const korean = locale === "ko";

    return (
        <DocSection
            id="token-variant"
            title={korean ? "변형" : "Variant"}
            description={korean ? "패널 레이아웃을 선택하면 아래 프리뷰에 바로 반영됩니다." : "Select a panel layout to update the preview below."}
        >
            <Stack gap="sizeLarge">
                <ControlGroup>
                    <div className="w-full max-w-refineui-menu-panel-width">
                        <ControlSelect
                            label={korean ? "레이아웃" : "Layout"}
                            value={layout}
                            options={layoutOptions}
                            onChange={setLayout}
                        />
                    </div>
                </ControlGroup>
                <NavigationMenuPreview layout={layout} />
            </Stack>
        </DocSection>
    );
}

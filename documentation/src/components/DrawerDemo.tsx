import {
    Button,
    Drawer,
    DrawerBody,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@refineui/react";
import { borderRadii, colors, spacings, strokeWidths, typographys } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

/** Demo stage inside Preview — Drawer shell renders via body portal only */
export default function DrawerDemo() {
    return (
        <PreviewFrame>
            <div
                data-drawer-demo-stage
                style={{
                    width: "100%",
                    minHeight: "min(52vh, 440px)",
                    boxSizing: "border-box",
                    padding: spacings.sizeLarge,
                    borderRadius: borderRadii.roundedMedium,
                    border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                    backgroundColor: colors.neutralWhite,
                }}
            >
                <div style={{ display: "grid", gap: spacings.sizeMedium }}>
                    <div style={{ display: "grid", gap: spacings.sizeSmall }}>
                        <p style={{ margin: 0, ...typographys.body4, color: colors.neutral700 }}>Overlay Preview</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeSmall }}>
                        <Drawer>
                            <DrawerTrigger>Overlay / Small / Right / Footer Split</DrawerTrigger>
                            <DrawerContent type="overlay" size="sm" placement="right">
                                <DrawerHeader>
                                    <DrawerTitle>Drawer title</DrawerTitle>
                                    <DrawerDescription>Footer state = split (double button)</DrawerDescription>
                                </DrawerHeader>
                                <DrawerBody>
                                    <p style={{ margin: 0 }}>Drawer Content</p>
                                </DrawerBody>
                                <DrawerFooter state="split">
                                    <DrawerClose variant="outline">Cancel</DrawerClose>
                                    <Button>Submit</Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>

                        <Drawer>
                            <DrawerTrigger variant="secondary">Overlay / Medium / Left / Footer Icons</DrawerTrigger>
                            <DrawerContent type="overlay" size="md" placement="left">
                                <DrawerHeader>
                                    <DrawerTitle>Left Medium drawer</DrawerTitle>
                                    <DrawerDescription>Footer state = icons</DrawerDescription>
                                </DrawerHeader>
                                <DrawerBody>
                                    <p style={{ margin: 0 }}>Footer uses four icon buttons.</p>
                                </DrawerBody>
                                <DrawerFooter state="icons">
                                    <DrawerClose />
                                    <DrawerClose />
                                    <DrawerClose />
                                    <DrawerClose />
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>

                        <Drawer>
                            <DrawerTrigger variant="secondary">Overlay / Large / Right / Footer Single</DrawerTrigger>
                            <DrawerContent type="overlay" size="lg" placement="right">
                                <DrawerHeader>
                                    <DrawerTitle>Right Large drawer</DrawerTitle>
                                    <DrawerDescription>Footer state = single (full width button)</DrawerDescription>
                                </DrawerHeader>
                                <DrawerBody>
                                    <p style={{ margin: 0 }}>Footer uses a single full-width action.</p>
                                </DrawerBody>
                                <DrawerFooter state="single">
                                    <Button style={{ width: "100%" }}>OK</Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                        </div>
                    </div>

                    <div style={{ display: "grid", gap: spacings.sizeSmall }}>
                        <p style={{ margin: 0, ...typographys.body4, color: colors.neutral700 }}>Inline Preview</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeSmall }}>
                        <Drawer type="inline" size="sm">
                            <DrawerContent>
                                <DrawerHeader showClose={false}>
                                    <DrawerTitle>Inline / Small</DrawerTitle>
                                    <DrawerDescription>Renders inline in the page</DrawerDescription>
                                </DrawerHeader>
                                <DrawerBody>
                                    <p style={{ margin: 0 }}>Shown inline without scrim or portal.</p>
                                </DrawerBody>
                                <DrawerFooter state="single">
                                    <Button style={{ width: "100%" }}>OK</Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                        </div>
                    </div>
                </div>

                <p
                    style={{
                        marginTop: spacings.sizeMedium,
                        marginBottom: 0,
                        maxWidth: "42rem",
                        ...typographys.body4,
                        color: colors.neutral600,
                    }}
                >
                    This preview covers Type (Overlay/Inline), Size, Placement, and footer variants together—not a
                    single case. Overlay drawers render as a <strong>full-page</strong> layer.
                </p>
            </div>
        </PreviewFrame>
    );
}

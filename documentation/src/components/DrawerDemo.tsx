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

/** Preview 안에서 본문과 구분되는 데모 무대 — Drawer 본체는 body 포털로만 렌더됨 */
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
                                    <DrawerTitle>Drawer 제목</DrawerTitle>
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
                                    <DrawerTitle>왼쪽 Medium Drawer</DrawerTitle>
                                    <DrawerDescription>Footer state = icons</DrawerDescription>
                                </DrawerHeader>
                                <DrawerBody>
                                    <p style={{ margin: 0 }}>아이콘 버튼 4개 상태입니다.</p>
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
                                    <DrawerTitle>오른쪽 Large Drawer</DrawerTitle>
                                    <DrawerDescription>Footer state = single (full width button)</DrawerDescription>
                                </DrawerHeader>
                                <DrawerBody>
                                    <p style={{ margin: 0 }}>단일 액션 버튼 상태입니다.</p>
                                </DrawerBody>
                                <DrawerFooter state="single">
                                    <Button style={{ width: "100%" }}>확인</Button>
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
                                    <DrawerDescription>페이지 안에서 바로 렌더</DrawerDescription>
                                </DrawerHeader>
                                <DrawerBody>
                                    <p style={{ margin: 0 }}>스크림/포털 없이 인라인으로 표시됩니다.</p>
                                </DrawerBody>
                                <DrawerFooter state="single">
                                    <Button style={{ width: "100%" }}>확인</Button>
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
                    Drawer Preview는 단일 케이스가 아니라 Type(Overlay/Inline), Size, Placement, showFooter 상태를
                    함께 보여주도록 구성했습니다. Overlay는 <strong>페이지 전체</strong> 레이어로 렌더됩니다.
                </p>
            </div>
        </PreviewFrame>
    );
}

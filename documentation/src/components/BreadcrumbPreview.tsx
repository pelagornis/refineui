import { colors, fontSizes, spacings } from "@refineui/tokens";
import {
    Breadcrumb,
    BreadcrumbEllipsisTrigger,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const caption = {
    margin: 0,
    marginBottom: spacings.sizeSmall,
    fontSize: fontSizes.fontSize200,
    color: colors.neutral600,
} as const;

/**
 * Web Kit Breadcrumb `283:688` (Figma Short / Long) — Long: 링크 / ⋯ / 링크 / 링크 / 현재
 * ⋯ 메뉴는 **Menu** 컴파운드 API. `BreadcrumbItem`은 기본 `overflow-clip`이라 `Menu` 패널(absolute)이 잘리므로, ⋯ 셀에 `overflow-visible` 필요. `minHeight`는 패널이 뷰에 들어가게.
 */
export default function BreadcrumbPreview() {
    return (
        <PreviewFrame minHeight="min(55vh, 520px)">
            <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, width: "100%" }}>
                <div>
                    <p style={caption}>Short — 링크 · 링크 · 현재 (구분자 /)</p>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">문서</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>컴포넌트</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div>
                    <p style={caption}>Long — 링크 / ⋯(메뉴) / 링크 / 링크 / 현재</p>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="overflow-visible">
                                <Menu positioning={{ autoSize: true }}>
                                    <MenuTrigger>
                                        <BreadcrumbEllipsisTrigger aria-label="중간 경로 메뉴" />
                                    </MenuTrigger>
                                    <MenuPopover>
                                        <MenuList className="w-refineui-menu-panel-width">
                                            <MenuItem onClick={() => {}}>문서</MenuItem>
                                            <MenuItem onClick={() => {}}>가이드</MenuItem>
                                        </MenuList>
                                    </MenuPopover>
                                </Menu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">API</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">참조</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>현재 페이지</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </PreviewFrame>
    );
}

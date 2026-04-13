import { colors, fontSizes, spacings } from "@refineui/tokens";
import {
    Breadcrumb,
    BreadcrumbEllipsisTrigger,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Dropdown,
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
 * Dropdown 프리뷰는 메뉴가 잘리지 않도록 `minHeight` 사용 (DropdownDemo 와 동일)
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
                            <BreadcrumbItem>
                                <Dropdown
                                    align="start"
                                    trigger={<BreadcrumbEllipsisTrigger aria-label="중간 경로 메뉴" />}
                                    items={[
                                        { id: "a", label: "문서", onClick: () => {} },
                                        { id: "b", label: "가이드", onClick: () => {} },
                                    ]}
                                />
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

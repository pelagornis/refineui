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
    marginBottom: spacings.sizeXSmall,
    fontSize: fontSizes.fontSize200,
    color: colors.neutral600,
} as const;

/**
 * Web Kit Breadcrumb `283:688` (Figma Short / Long) — Long: link / ⋯ / link / link / current.
 * ⋯ uses the **Menu** compound API. `BreadcrumbItem` defaults to `overflow-clip`, so the `Menu` panel (absolute) clips — set `overflow-visible` on the ⋯ cell. `minHeight` keeps the panel in view.
 */
export default function BreadcrumbPreview() {
    return (
        <PreviewFrame minHeight="min(55vh, 520px)">
            <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, width: "100%" }}>
                <div>
                    <p style={caption}>Short — link · link · current (separator /)</p>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Docs</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Components</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div>
                    <p style={caption}>Long — link / ⋯ (menu) / link / link / current</p>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="overflow-visible">
                                <Menu positioning={{ autoSize: true }}>
                                    <MenuTrigger>
                                        <BreadcrumbEllipsisTrigger aria-label="Middle path menu" />
                                    </MenuTrigger>
                                    <MenuPopover>
                                        <MenuList className="w-refineui-menu-panel-width">
                                            <MenuItem onClick={() => {}}>Docs</MenuItem>
                                            <MenuItem onClick={() => {}}>Guide</MenuItem>
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
                                <BreadcrumbLink href="#">Reference</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Current page</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </PreviewFrame>
    );
}

import { type ReactNode } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    Stack,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

function ContentGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid w-full min-w-refineui-menu-panel-width grid-cols-2 gap-refineui-size-x-small">
            {children}
        </div>
    );
}

function LinkStack({ title, description }: { title: string; description: string }) {
    return (
        <Stack as="span" gap="sizeXXXSmall" className="min-w-0 flex-1 px-refineui-size-xxx-small">
            <span className="truncate">{title}</span>
            <span className="truncate text-refineui-alias-foreground-tertiary refineui-typo-caption-1">
                {description}
            </span>
        </Stack>
    );
}

export default function NavigationMenuPreview() {
    return (
        <Looks>
            <Look>
                <NavigationMenu defaultValue="products">
                    <NavigationMenuList>
                        <NavigationMenuItem value="products">
                            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ContentGrid>
                                    <NavigationMenuLink href="#components">
                                        <LinkStack title="Components" description="Buttons, inputs, overlays" />
                                    </NavigationMenuLink>
                                    <NavigationMenuLink href="#tokens">
                                        <LinkStack title="Tokens" description="Color, space, type" />
                                    </NavigationMenuLink>
                                    <NavigationMenuLink href="#icons">
                                        <LinkStack title="Icons" description="System icon set" />
                                    </NavigationMenuLink>
                                    <NavigationMenuLink href="#motion">
                                        <LinkStack title="Motion" description="Duration and easing" />
                                    </NavigationMenuLink>
                                </ContentGrid>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem value="docs">
                            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ContentGrid>
                                    <NavigationMenuLink href="#getting-started">
                                        <LinkStack title="Getting started" description="Install and import" />
                                    </NavigationMenuLink>
                                    <NavigationMenuLink href="#theming">
                                        <LinkStack title="Theming" description="Tokens and aliases" />
                                    </NavigationMenuLink>
                                    <NavigationMenuLink href="#accessibility">
                                        <LinkStack title="Accessibility" description="Keyboard and landmarks" />
                                    </NavigationMenuLink>
                                    <NavigationMenuLink href="#composition">
                                        <LinkStack title="Composition" description="Slots and structure" />
                                    </NavigationMenuLink>
                                </ContentGrid>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem value="pricing">
                            <NavigationMenuLink href="#pricing">Pricing</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem value="blog">
                            <NavigationMenuLink href="#blog" active>
                                Blog
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </Look>
        </Looks>
    );
}

import { type ReactNode } from "react";
import { spacings } from "@refineui/tokens";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

function ContentGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: spacings.sizeXSmall,
        width: "min(100%, 320px)",
      }}
    >
      {children}
    </div>
  );
}

function LinkStack({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <span
      style={{
        display: "flex",
        minWidth: 0,
        flex: 1,
        flexDirection: "column",
        gap: spacings.sizeXXXSmall,
        paddingInline: spacings.sizeXXXSmall,
      }}
    >
      <span className="truncate">{title}</span>
      <span className="truncate text-refineui-alias-foreground-tertiary refineui-typo-caption-1">
        {description}
      </span>
    </span>
  );
}

export default function NavigationMenuPreview() {
  return (
    <PreviewFrame>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: spacings.sizeXXXLarge,
          minHeight: "220px",
        }}
      >
        <NavigationMenu>
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
                    <LinkStack title="Getting started" description="Install and first import" />
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#theming">
                    <LinkStack title="Theming" description="Tokens and color aliases" />
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#accessibility">
                    <LinkStack title="Accessibility" description="Keyboard and landmarks" />
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#composition">
                    <LinkStack title="Composition" description="Slots without convenience props" />
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
      </div>
    </PreviewFrame>
  );
}

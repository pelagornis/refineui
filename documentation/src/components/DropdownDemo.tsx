"use client";

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownPortal,
  DropdownSeparator,
  DropdownShortcut,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
  WebIcon,
} from "@refineui/react";
import { iconSizes } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

export default function DropdownDemo() {
  return (
      <PreviewFrame title="Dropdown — basic composition" minHeight="min(56vh, 560px)">
        <p className="m-0 mb-refineui-size-large refineui-typo-caption-2 text-refineui-alias-foreground-secondary">
          Basic pattern using only the `Dropdown` composed API.
          <strong className="font-medium"> DropdownSub</strong> follows the same pattern.
        </p>
        <div className="flex flex-wrap items-start gap-refineui-size-xlarge">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="outline" size="sm" type="button">
                Open
              </Button>
            </DropdownTrigger>
            <DropdownContent className="w-40" align="start">
              <DropdownGroup>
                <DropdownLabel>My Account</DropdownLabel>
                <DropdownItem>
                  Profile
                  <DropdownShortcut>⇧⌘P</DropdownShortcut>
                </DropdownItem>
                <DropdownItem>
                  Billing
                  <DropdownShortcut>⌘B</DropdownShortcut>
                </DropdownItem>
                <DropdownItem>
                  Settings
                  <DropdownShortcut>⌘S</DropdownShortcut>
                </DropdownItem>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownItem>Team</DropdownItem>
                <DropdownSub>
                  <DropdownSubTrigger>Invite users</DropdownSubTrigger>
                  <DropdownPortal>
                    <DropdownSubContent>
                      <DropdownItem>Email</DropdownItem>
                      <DropdownItem>Message</DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem>More...</DropdownItem>
                    </DropdownSubContent>
                  </DropdownPortal>
                </DropdownSub>
                <DropdownItem>
                  New Team
                  <DropdownShortcut>⌘+T</DropdownShortcut>
                </DropdownItem>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownItem>GitHub</DropdownItem>
                <DropdownItem>Support</DropdownItem>
                <DropdownItem disabled>API</DropdownItem>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownItem>
                  Log out
                  <DropdownShortcut>⇧⌘Q</DropdownShortcut>
                </DropdownItem>
              </DropdownGroup>
            </DropdownContent>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="secondary" size="sm" type="button" className="gap-refineui-size-medium">
                Actions
                <WebIcon name="chevron-down" size={iconSizes.small} color="currentColor" aria-hidden />
              </Button>
            </DropdownTrigger>
            <DropdownContent align="start" className="min-w-44">
              <DropdownGroup>
                <DropdownLabel>File</DropdownLabel>
                <DropdownItem>
                  New tab
                  <DropdownShortcut>⌘T</DropdownShortcut>
                </DropdownItem>
                <DropdownSub>
                  <DropdownSubTrigger>Share…</DropdownSubTrigger>
                  <DropdownPortal>
                    <DropdownSubContent>
                      <DropdownItem>Copy link</DropdownItem>
                      <DropdownItem>Send email</DropdownItem>
                    </DropdownSubContent>
                  </DropdownPortal>
                </DropdownSub>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownItem disabled>Disabled example</DropdownItem>
              </DropdownGroup>
            </DropdownContent>
          </Dropdown>
        </div>
      </PreviewFrame>
  );
}

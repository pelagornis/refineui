"use client";

import type { ReactNode } from "react";
import {
  Avatar,
  AvatarImage,
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

const PROFILE_SRC = "https://avatars.githubusercontent.com/u/108743931?s=200&v=4";

function RowIcon({ name }: { name: string }) {
  return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

function ItemLabel({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="flex min-w-0 items-center gap-refineui-size-x-small">
      <RowIcon name={icon} />
      <span className="truncate">{children}</span>
    </span>
  );
}

function ProfileAvatar({ size }: { size: "sm" | "md" }) {
  return (
    <Avatar size={size} alt="Jihoon Ahn" showStatus status="online">
      <AvatarImage src={PROFILE_SRC} alt="Jihoon Ahn" />
    </Avatar>
  );
}

export default function DropdownDemo() {
  return (
    <PreviewFrame title="Account menu · profile dropdown" minHeight="min(64vh, 640px)">
      <div className="flex flex-wrap items-start gap-refineui-size-xx-large">
        <section className="flex flex-col gap-refineui-size-medium">
          <p className="m-0 refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
            Avatar trigger · identity header · shortcuts · submenu
          </p>
          <Dropdown defaultOpen>
            <DropdownTrigger>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-refineui-size-x-small px-refineui-size-x-small"
              >
                <ProfileAvatar size="sm" />
                <span className="refineui-typo-body-2 text-refineui-alias-foreground-primary">Jihoon</span>
                <WebIcon name="chevron-down" size={iconSizes.xsmall} color="currentColor" aria-hidden />
              </Button>
            </DropdownTrigger>
            <DropdownContent align="start">
              <div className="flex items-center gap-refineui-size-x-small px-refineui-size-x-small py-refineui-size-x-small">
                <ProfileAvatar size="md" />
                <div className="min-w-0 flex-1">
                  <div className="truncate refineui-typo-body-2 text-refineui-alias-foreground-primary">
                    Jihoon Ahn
                  </div>
                  <div className="truncate refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
                    jihoon@pelagornis.com
                  </div>
                </div>
              </div>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownLabel>Account</DropdownLabel>
                <DropdownItem>
                  <ItemLabel icon="person">Profile</ItemLabel>
                  <DropdownShortcut>⇧⌘P</DropdownShortcut>
                </DropdownItem>
                <DropdownItem>
                  <ItemLabel icon="settings">Settings</ItemLabel>
                  <DropdownShortcut>⌘,</DropdownShortcut>
                </DropdownItem>
                <DropdownItem>
                  <ItemLabel icon="payment">Billing</ItemLabel>
                  <DropdownShortcut>⌘B</DropdownShortcut>
                </DropdownItem>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownLabel>Workspace</DropdownLabel>
                <DropdownItem>
                  <ItemLabel icon="organization">Team</ItemLabel>
                </DropdownItem>
                <DropdownSub>
                  <DropdownSubTrigger>
                    <ItemLabel icon="guest">Invite users</ItemLabel>
                  </DropdownSubTrigger>
                  <DropdownPortal>
                    <DropdownSubContent>
                      <DropdownItem>
                        <ItemLabel icon="mail">Email invite</ItemLabel>
                      </DropdownItem>
                      <DropdownItem>
                        <ItemLabel icon="link">Copy invite link</ItemLabel>
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem>
                        <ItemLabel icon="send">Share invite</ItemLabel>
                      </DropdownItem>
                    </DropdownSubContent>
                  </DropdownPortal>
                </DropdownSub>
                <DropdownItem>
                  <ItemLabel icon="add">New team</ItemLabel>
                  <DropdownShortcut>⌘T</DropdownShortcut>
                </DropdownItem>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownItem>
                  <ItemLabel icon="open">GitHub</ItemLabel>
                </DropdownItem>
                <DropdownItem>
                  <ItemLabel icon="chat">Support</ItemLabel>
                </DropdownItem>
                <DropdownItem disabled>
                  <ItemLabel icon="code">API access</ItemLabel>
                </DropdownItem>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownItem>
                  <ItemLabel icon="power">Log out</ItemLabel>
                  <DropdownShortcut>⇧⌘Q</DropdownShortcut>
                </DropdownItem>
              </DropdownGroup>
            </DropdownContent>
          </Dropdown>
        </section>

        <section className="flex flex-col gap-refineui-size-medium">
          <p className="m-0 refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
            Compact actions · nested share
          </p>
          <Dropdown>
            <DropdownTrigger>
              <Button type="button" variant="outline" size="sm" className="gap-refineui-size-x-small">
                Actions
                <WebIcon name="chevron-down" size={iconSizes.xsmall} color="currentColor" aria-hidden />
              </Button>
            </DropdownTrigger>
            <DropdownContent align="start">
              <DropdownGroup>
                <DropdownLabel>File</DropdownLabel>
                <DropdownItem>
                  <ItemLabel icon="document">New tab</ItemLabel>
                  <DropdownShortcut>⌘T</DropdownShortcut>
                </DropdownItem>
                <DropdownItem>
                  <ItemLabel icon="copy">Duplicate</ItemLabel>
                  <DropdownShortcut>⌘D</DropdownShortcut>
                </DropdownItem>
                <DropdownSub>
                  <DropdownSubTrigger>
                    <ItemLabel icon="share">Share…</ItemLabel>
                  </DropdownSubTrigger>
                  <DropdownPortal>
                    <DropdownSubContent>
                      <DropdownItem>
                        <ItemLabel icon="link">Copy link</ItemLabel>
                      </DropdownItem>
                      <DropdownItem>
                        <ItemLabel icon="mail">Send email</ItemLabel>
                      </DropdownItem>
                    </DropdownSubContent>
                  </DropdownPortal>
                </DropdownSub>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownItem disabled>
                  <ItemLabel icon="lock-closed">Disabled</ItemLabel>
                </DropdownItem>
              </DropdownGroup>
            </DropdownContent>
          </Dropdown>
        </section>
      </div>
    </PreviewFrame>
  );
}

"use client";

import { type MouseEvent, useCallback, useMemo, useState } from "react";
import {
  Avatar,
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
  DropdownList,
  type DropdownListItem,
  WebIcon,
} from "@refineui/react";
import { iconSizes } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

/** Web Kit Dropdown `503:2985` — Figma 옵션: Default · Checkbox · Radio · Avatar · Button(More) */
const PLACEHOLDER = "Dropdown Menu Item Text";

const itemsDefault = [
  { id: "profile", label: "Profile", shortcut: "⌘P" },
  { id: "dashboard", label: "Dashboard", shortcut: "⌘D", selected: true },
  { id: "settings", label: "Settings", shortcut: "⌘S" },
];

const buildCheckboxItems = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: `cb-${i}`,
    label: PLACEHOLDER,
  }));

const buildRadioItems = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: `r-${i}`,
    label: PLACEHOLDER,
  }));

const iconMenu = (name: string) => (
  <WebIcon name={name} size={iconSizes.xsmall} color="currentColor" aria-hidden />
);

const itemsMore = [
  { id: "add", label: "Add", startIcon: iconMenu("add") },
  { id: "edit", label: "Edit", startIcon: iconMenu("edit") },
  { id: "share", label: "Share", startIcon: iconMenu("share") },
  { id: "delete", label: "Delete", startIcon: iconMenu("delete") },
];

const itemsAccount = [
  { id: "account", label: "Account", startIcon: iconMenu("person") },
  { id: "billing", label: "Billing", startIcon: iconMenu("payment") },
  { id: "notifications", label: "Notifications", startIcon: iconMenu("alert") },
  { id: "settings", label: "Settings", startIcon: iconMenu("settings") },
  { id: "signout", label: "Sign Out", startIcon: iconMenu("door") },
];

export default function DropdownDemo() {
  const checkboxIds = useMemo(() => buildCheckboxItems(7).map((x) => x.id), []);
  const radioIds = useMemo(() => buildRadioItems(8).map((x) => x.id), []);

  const [checkboxOn, setCheckboxOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(checkboxIds.map((id, i) => [id, i < 2])),
  );
  const [radioId, setRadioId] = useState(radioIds[0] ?? "");

  const checkboxItems: DropdownListItem[] = useMemo(
    () =>
      checkboxIds.map((id) => ({
        id,
        label: PLACEHOLDER,
        selection: "checkbox" as const,
        selected: checkboxOn[id] ?? false,
        onClick: () =>
          setCheckboxOn((prev) => ({
            ...prev,
            [id]: !prev[id],
          })),
      })),
    [checkboxIds, checkboxOn],
  );

  const radioItems: DropdownListItem[] = useMemo(
    () =>
      radioIds.map((id) => ({
        id,
        label: PLACEHOLDER,
        selection: "radio" as const,
        selected: radioId === id,
        onClick: () => setRadioId(id),
      })),
    [radioIds, radioId],
  );

  const stopOpen = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <PreviewFrame title="Web Kit `503:2985` — Figma 변형 한 눈에 (Default · Checkbox · Radio · Avatar · More)" minHeight="min(72vh, 920px)">
        <p className="m-0 mb-refineui-size-large refineui-typo-caption-2 text-refineui-alias-foreground-secondary">
          Web Kit 예시 페이지와 같이 변형별로 하나씩 배치했습니다. 마지막 열은 <strong className="font-medium">Submenu</strong>·
          <code className="rounded-refineui-small bg-refineui-alias-background-surface px-refineui-size-xxsmall">DropdownSub</code> 합성
          데모입니다. 서브 패널은 본문(z-index) 위에 뜨며, 열 때 <code className="rounded-refineui-small bg-refineui-alias-background-surface px-refineui-size-xxsmall">Share</code>를
          눌러 보세요.
        </p>
        <div className="grid w-full grid-cols-1 gap-refineui-size-xlarge sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="flex min-h-[120px] flex-col gap-refineui-size-small">
            <span className="refineui-typo-caption-1 font-medium text-refineui-alias-foreground-secondary">Default</span>
            <DropdownList
              menuTitle="Dropdown"
              trigger={
                <Button variant="secondary" size="sm" type="button" className="gap-refineui-size-medium">
                  Dropdown
                  <WebIcon name="chevron-down" size={iconSizes.small} color="currentColor" aria-hidden />
                </Button>
              }
              items={itemsDefault}
            />
          </div>

          <div className="flex min-h-[120px] flex-col gap-refineui-size-small">
            <span className="refineui-typo-caption-1 font-medium text-refineui-alias-foreground-secondary">Checkbox</span>
            <DropdownList
              align="start"
              menuTitle="Checkbox"
              trigger={
                <Button variant="secondary" size="sm" type="button">
                  Checkboxes
                </Button>
              }
              items={checkboxItems}
            />
          </div>

          <div className="flex min-h-[120px] flex-col gap-refineui-size-small">
            <span className="refineui-typo-caption-1 font-medium text-refineui-alias-foreground-secondary">Radio</span>
            <DropdownList
              align="start"
              menuTitle="Radio"
              trigger={
                <Button variant="secondary" size="sm" type="button">
                  Radio
                </Button>
              }
              items={radioItems}
            />
          </div>

          <div className="flex min-h-[120px] flex-col gap-refineui-size-small">
            <span className="refineui-typo-caption-1 font-medium text-refineui-alias-foreground-secondary">Avatar</span>
            <DropdownList
              align="start"
              menuTitle={
                <>
                  <Avatar size="xxsmall" layout="initials" color="green" alt="pelagornis" />
                  <span>@pelagornis</span>
                </>
              }
              trigger={
                <button
                  type="button"
                  className="inline-flex cursor-pointer rounded-refineui-circle border-none bg-transparent p-0"
                  aria-label="Open account menu"
                >
                  <Avatar size="xxsmall" layout="initials" color="green" alt="pelagornis" />
                </button>
              }
              items={itemsAccount}
            />
          </div>

          <div className="flex min-h-[120px] flex-col gap-refineui-size-small">
            <span className="refineui-typo-caption-1 font-medium text-refineui-alias-foreground-secondary">Button · More</span>
            <DropdownList
              align="start"
              menuTitle="More"
              trigger={
                <Button variant="outline" size="sm" layout="icon" type="button" aria-label="More actions">
                  <WebIcon name="more-horizontal" size={iconSizes.small} color="currentColor" aria-hidden />
                </Button>
              }
              items={itemsMore}
            />
          </div>

          <div className="flex min-h-[120px] flex-col gap-refineui-size-small xl:col-span-1">
            <span className="refineui-typo-caption-1 font-medium text-refineui-alias-foreground-secondary">Submenu</span>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="secondary" size="sm" type="button" className="gap-refineui-size-medium">
                  Actions
                  <WebIcon name="chevron-down" size={iconSizes.small} color="currentColor" aria-hidden />
                </Button>
              </DropdownTrigger>
              <DropdownContent align="start" className="min-w-44">
                <DropdownGroup>
                  <DropdownLabel>파일</DropdownLabel>
                  <DropdownItem>
                    새 탭
                    <DropdownShortcut>⌘T</DropdownShortcut>
                  </DropdownItem>
                  <DropdownSub>
                    <DropdownSubTrigger>공유…</DropdownSubTrigger>
                    <DropdownPortal>
                      <DropdownSubContent>
                        <DropdownItem>링크 복사</DropdownItem>
                        <DropdownItem>메일 보내기</DropdownItem>
                      </DropdownSubContent>
                    </DropdownPortal>
                  </DropdownSub>
                </DropdownGroup>
                <DropdownSeparator />
                <DropdownGroup>
                  <DropdownItem disabled>비활성 예시</DropdownItem>
                </DropdownGroup>
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </PreviewFrame>

      <PreviewFrame title="Dropdown — 합성 API (라벨 · 단축키 · 서브메뉴)" minHeight="min(56vh, 560px)">
        <p className="m-0 mb-refineui-size-medium refineui-typo-caption-2 text-refineui-alias-foreground-secondary">
          `Button` 은 <code className="rounded-refineui-small bg-refineui-alias-background-surface px-refineui-size-xxsmall">DropdownTrigger</code> 자식 한 개로 두면
          (`PopoverTrigger`·<code className="rounded-refineui-small bg-refineui-alias-background-surface px-refineui-size-xxsmall">MenuTrigger</code>와 같이) ref·이벤트가 자동 병합됩니다.
          패널은 문서 루트로 포털되며, 열리면 배경 스크롤도 잠깁니다.
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
              <Button variant="secondary" size="sm" type="button">
                align end
              </Button>
            </DropdownTrigger>
            <DropdownContent align="end" side="bottom">
              <DropdownItem>One</DropdownItem>
              <DropdownItem>Two</DropdownItem>
            </DropdownContent>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="secondary" size="sm" type="button">
                side top
              </Button>
            </DropdownTrigger>
            <DropdownContent align="start" side="top">
              <DropdownItem>Alpha</DropdownItem>
              <DropdownItem>Beta</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </PreviewFrame>

      <PreviewFrame title="열림 시 배경(문서) 스크롤 잠금" minHeight="min(40vh, 360px)">
        <p className="m-0 mb-refineui-size-medium refineui-typo-caption-2 text-refineui-alias-foreground-secondary">
          메뉴가 열리면 <code className="rounded-refineui-small bg-refineui-alias-background-surface px-refineui-size-xxsmall">body</code> /{" "}
          <code className="rounded-refineui-small bg-refineui-alias-background-surface px-refineui-size-xxsmall">html</code> 스크롤이 막혀 페이지 뒤가
          움직이지 않습니다. 드롭다운을 연 뒤 이 문서를 스크롤해 보세요.
        </p>
        <DropdownList
          menuTitle="Dropdown"
          trigger={
            <Button variant="secondary" size="sm" type="button" className="gap-refineui-size-medium">
              열고 스크롤 테스트
              <WebIcon name="chevron-down" size={iconSizes.small} color="currentColor" aria-hidden />
            </Button>
          }
          items={itemsDefault}
        />
      </PreviewFrame>

      <PreviewFrame title="추가 데모 — 셰브론 분리 · 정렬 · 필드 내장 · 스크롤 추적" minHeight="min(64vh, 720px)">
        <div className="flex flex-col gap-refineui-size-xlarge">
          <div>
            <p className="m-0 mb-refineui-size-medium refineui-typo-caption-2 text-refineui-alias-foreground-secondary">showTriggerChevron</p>
            <DropdownList
              showTriggerChevron
              menuTitle="Dropdown"
              trigger={
                <Button variant="secondary" size="sm" type="button">
                  Dropdown
                </Button>
              }
              items={itemsDefault}
            />
          </div>

          <div>
            <p className="m-0 mb-refineui-size-medium refineui-typo-caption-2 text-refineui-alias-foreground-secondary">align / side</p>
            <div className="flex flex-wrap items-start gap-refineui-size-xlarge">
              <DropdownList
                align="end"
                side="auto"
                menuTitle="Dropdown"
                trigger={
                  <Button variant="secondary" size="sm" type="button" className="gap-refineui-size-medium">
                    align end
                    <WebIcon name="chevron-down" size={iconSizes.small} color="currentColor" aria-hidden />
                  </Button>
                }
                items={itemsDefault}
              />
              <DropdownList
                align="start"
                side="top"
                menuTitle="Dropdown"
                trigger={
                  <Button variant="secondary" size="sm" type="button" className="gap-refineui-size-medium">
                    side top
                    <WebIcon name="chevron-down" size={iconSizes.small} color="currentColor" aria-hidden />
                  </Button>
                }
                items={itemsDefault}
              />
            </div>
          </div>

          <div>
            <p className="m-0 mb-refineui-size-medium refineui-typo-caption-2 text-refineui-alias-foreground-secondary">필드 안 트리거</p>
            <div className="flex max-w-[200px] flex-col gap-refineui-size-medium">
              <label className="refineui-typo-caption-1 text-refineui-alias-foreground-secondary" htmlFor="demo-field">
                Label
              </label>
              <div className="inline-flex w-full min-w-0 rounded-refineui-medium border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary">
                <input
                  id="demo-field"
                  type="text"
                  placeholder="Focus stays in field"
                  className="min-w-0 flex-1 border-none bg-transparent px-refineui-size-medium py-refineui-size-small refineui-typo-body-2 outline-none"
                  onMouseDown={stopOpen}
                  onClick={stopOpen}
                />
                <DropdownList
                  className="shrink-0"
                  align="end"
                  showTriggerChevron
                  menuTitle="Field"
                  trigger={
                    <Button variant="ghost" size="sm" type="button" className="rounded-none">
                      Unit
                    </Button>
                  }
                  items={itemsDefault}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="m-0 mb-refineui-size-medium refineui-typo-caption-2 text-refineui-alias-foreground-secondary">
              스크롤 가능한 영역 안 — 열린 메뉴가 트리거에 붙는지
            </p>
            <div className="box-border max-h-[220px] w-full overflow-auto rounded-refineui-xlarge border-refineui-hairline border-refineui-alias-border-default p-refineui-size-medium">
              <div style={{ height: 120 }} />
              <div className="flex flex-wrap items-start gap-refineui-size-large">
                <DropdownList
                  showTriggerChevron
                  menuTitle="Dropdown"
                  trigger={
                    <Button variant="secondary" size="sm" type="button">
                      Dropdown
                    </Button>
                  }
                  items={itemsDefault}
                />
              </div>
              <div style={{ height: 160 }} />
            </div>
          </div>
        </div>
      </PreviewFrame>
    </>
  );
}

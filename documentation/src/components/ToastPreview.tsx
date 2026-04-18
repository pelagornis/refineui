import { useState, type CSSProperties } from "react";
import { colors, fontSizes, fontWeights, iconSizes, spacings } from "@refineui/tokens";
import {
  Avatar,
  AvatarImage,
  Button,
  Spinner,
  Toast,
  Toaster,
  WebIcon,
  toast,
  type ToastPosition,
  type ToastVariant,
} from "@refineui/react";

import PreviewFrame from "./PreviewFrame";

const sectionLabel: CSSProperties = {
  fontSize: fontSizes.fontSize200,
  fontWeight: fontWeights.fontWeightSemibold,
  color: colors.neutral600,
  margin: 0,
  marginBottom: spacings.sizeMedium,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

const sectionGap: CSSProperties = { marginTop: spacings.sizeXXLarge };

const mutedBody: CSSProperties = {
  margin: 0,
  marginBottom: spacings.sizeMedium,
  fontSize: fontSizes.fontSize200,
  color: colors.neutral600,
  lineHeight: 1.45,
};

const actionPrimary = { label: "Action", onClick: () => {} } as const;

const toasterPositions: { value: ToastPosition; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

export default function ToastPreview() {
  const [toasterPosition, setToasterPosition] = useState<ToastPosition>("top-center");

  const spawnToast = (variant: ToastVariant) => {
    const map = {
      default: { title: "Toast", description: "짧은 설명이 여기에 표시됩니다." },
      success: { title: "완료", description: "작업이 성공적으로 처리되었습니다." },
      warning: { title: "주의", description: "이 작업은 되돌릴 수 없습니다." },
      error: { title: "오류", description: "요청을 처리하지 못했습니다." },
    } as const;
    const item = map[variant];
    toast(item.title, { variant, description: item.description, action: { ...actionPrimary } });
  };

  const spawnNoAction = () => {
    toast("저장됨", { variant: "success", description: "액션 없이 본문만 표시합니다." });
  };

  const spawnSecondaryAction = () => {
    toast("휴지통으로 이동", {
      variant: "default",
      description: "보조(Outline) 액션 예시입니다.",
      action: { label: "실행 취소", onClick: () => {}, variant: "secondary" },
    });
  };

  const spawnLongBody = () => {
    toast("동기화", {
      variant: "default",
      description:
        "여러 줄에 가까운 긴 설명입니다. 카드 폭은 325px로 고정이며 본문은 줄바꿈됩니다. 아이콘 슬롯은 카드 세로 중앙에 맞춰집니다.",
      action: { label: "Action", onClick: () => {} },
    });
  };

  const spawnStack = () => {
    spawnToast("default");
    globalThis.setTimeout(() => spawnToast("success"), 120);
    globalThis.setTimeout(() => spawnToast("warning"), 240);
  };

  const spawnSpinnerLeading = () => {
    toast("동기화 중", {
      variant: "default",
      description: "Leading 슬롯에 Spinner 컴포넌트를 넣은 예시입니다.",
      icon: <Spinner size="xSmall" />,
      action: { label: "취소", onClick: () => {}, variant: "secondary" },
    });
  };

  const spawnAvatarLeading = () => {
    toast("새 메시지", {
      variant: "default",
      description: "Leading 슬롯에 Avatar 컴포넌트를 넣은 예시입니다.",
      icon: (
        <Avatar size="xsmall" aria-hidden>
          <AvatarImage src="https://avatars.githubusercontent.com/u/108743931?s=80&v=4" alt="" />
        </Avatar>
      ),
      action: { ...actionPrimary },
    });
  };

  return (
    <PreviewFrame minHeight="200px">
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeXXLarge, width: "100%" }}>
        <section>
          <p style={sectionLabel}>Type · 인라인 카드</p>
          <div
            style={{
              display: "grid",
              gap: spacings.sizeLarge,
              width: "100%",
              maxWidth: 360,
            }}
          >
            <Toast
              variant="default"
              title="Default"
              message="정보 톤 · 기본 아이콘"
              action={{ ...actionPrimary }}
            />
            <Toast
              variant="success"
              title="Success"
              message="성공 상태 메시지"
              action={{ ...actionPrimary }}
            />
            <Toast
              variant="warning"
              title="Warning"
              message="주의가 필요할 때"
              action={{ ...actionPrimary }}
            />
            <Toast variant="error" title="Error" message="오류 또는 실패" action={{ ...actionPrimary }} />
          </div>
        </section>

        <section style={sectionGap}>
          <p style={sectionLabel}>구성 예시</p>
          <div style={{ display: "grid", gap: spacings.sizeLarge, maxWidth: 360 }}>
            <Toast variant="default" title="제목만" />
            <Toast
              variant="success"
              title="액션 없음"
              message="오른쪽 버튼 없이 본문만 두었습니다."
            />
            <Toast
              variant="default"
              title="커스텀 아이콘"
              message="icon prop으로 leading 슬롯을 덮어씁니다."
              icon={<WebIcon name="mail" size={iconSizes.medium} color={colors.primaryBlack} aria-hidden />}
              action={{ ...actionPrimary }}
            />
          </div>
        </section>

        <section style={sectionGap}>
          <p style={sectionLabel}>Leading · Spinner / Avatar</p>
          <p style={mutedBody}>
            <code>Toast / Icon</code> 자리에 <code>Spinner</code>, <code>Avatar</code> 등 패키지 컴포넌트를{" "}
            <code>icon</code>으로 넣을 수 있습니다.
          </p>
          <div style={{ display: "grid", gap: spacings.sizeLarge, maxWidth: 360 }}>
            <Toast
              variant="default"
              title="처리 중"
              message="로딩 상태 — 왼쪽은 Spinner (xSmall)."
              icon={<Spinner size="xSmall" />}
              action={{ label: "취소", onClick: () => {}, variant: "secondary" }}
            />
            <Toast
              variant="default"
              title="알림"
              message="보낸 사람 — Avatar는 xsmall(24px)로 슬롯에 맞춥니다."
              icon={
                <Avatar size="xsmall" color="blue" alt="Kim Min" aria-hidden />
              }
              action={{ ...actionPrimary }}
            />
            <Toast
              variant="default"
              title="멘션"
              message="이미지 Avatar + AvatarImage 조합."
              icon={
                <Avatar size="xsmall" aria-hidden>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/9919?s=80&v=4" alt="" />
                </Avatar>
              }
              action={{ ...actionPrimary }}
            />
          </div>
        </section>

        <section style={sectionGap}>
          <p style={sectionLabel}>toast() · 포털 & 스택</p>
          <p style={mutedBody}>
            <code>Toaster</code>의 <code>position</code>으로 뷰포트 앵커를 바꿀 수 있습니다.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: spacings.sizeSmall,
              marginBottom: spacings.sizeLarge,
            }}
          >
            {toasterPositions.map(({ value, label }) => (
              <Button
                key={value}
                variant={toasterPosition === value ? "primary" : "outline"}
                size="sm"
                onClick={() => setToasterPosition(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div style={{ position: "relative", minHeight: 200 }}>
            <Toaster position={toasterPosition} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeSmall }}>
              <Button variant="primary" size="sm" onClick={() => spawnToast("default")}>
                기본
              </Button>
              <Button variant="secondary" size="sm" onClick={() => spawnToast("success")}>
                성공
              </Button>
              <Button variant="outline" size="sm" onClick={() => spawnToast("warning")}>
                주의
              </Button>
              <Button variant="ghost" size="sm" onClick={() => spawnToast("error")}>
                오류
              </Button>
              <Button variant="outline" size="sm" onClick={spawnNoAction}>
                액션 없음
              </Button>
              <Button variant="outline" size="sm" onClick={spawnSecondaryAction}>
                보조 액션
              </Button>
              <Button variant="outline" size="sm" onClick={spawnLongBody}>
                긴 본문
              </Button>
              <Button variant="secondary" size="sm" onClick={spawnStack}>
                스택 3개
              </Button>
              <Button variant="outline" size="sm" onClick={spawnSpinnerLeading}>
                Leading Spinner
              </Button>
              <Button variant="outline" size="sm" onClick={spawnAvatarLeading}>
                Leading Avatar
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PreviewFrame>
  );
}

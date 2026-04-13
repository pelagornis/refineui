import { spacings } from "@refineui/tokens";
import { Field, Input } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function FieldPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, maxWidth: "320px" }}>
        <Field label="이메일" required>
          <Input type="email" placeholder="email@example.com" />
        </Field>
        <Field label="비밀번호" error="비밀번호를 입력해주세요">
          <Input type="password" placeholder="••••••••" />
        </Field>
        <Field label="닉네임" hint="2~12자">
          <Input placeholder="입력" success />
        </Field>
        <Field label="설명" hint="8자 이상 입력해주세요">
          <Input placeholder="입력" />
        </Field>
        <Field label="Large 라벨" size="lg" hint="size=lg → body1">
          <Input placeholder="입력" />
        </Field>
      </div>
    </PreviewFrame>
  );
}

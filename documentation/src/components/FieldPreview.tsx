import { spacings } from "@refineui/tokens";
import { Field, FieldError, FieldHint, FieldLabel, FieldRequired, Input } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function FieldPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, maxWidth: "320px" }}>
        <Field>
          <FieldLabel>
            이메일
            <FieldRequired />
          </FieldLabel>
          <Input type="email" placeholder="email@example.com" />
        </Field>
        <Field>
          <FieldLabel>비밀번호</FieldLabel>
          <Input type="password" placeholder="••••••••" />
          <FieldError>비밀번호를 입력해주세요</FieldError>
        </Field>
        <Field>
          <FieldLabel>닉네임</FieldLabel>
          <Input placeholder="입력" success />
          <FieldHint>2~12자</FieldHint>
        </Field>
        <Field>
          <FieldLabel>설명</FieldLabel>
          <Input placeholder="입력" />
          <FieldHint>8자 이상 입력해주세요</FieldHint>
        </Field>
        <Field size="lg">
          <FieldLabel>Large 라벨</FieldLabel>
          <Input placeholder="입력" />
          <FieldHint>size=lg → body1</FieldHint>
        </Field>
      </div>
    </PreviewFrame>
  );
}

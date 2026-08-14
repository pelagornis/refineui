import { useState, type ReactNode } from "react";
import { spacings } from "@refineui/tokens";
import { InputOTP, InputOTPSlot } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

function DemoLabel({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        color: "var(--refineui-color-alias-foreground-secondary)",
        fontSize: "var(--refineui-font-size-caption1)",
        lineHeight: "var(--refineui-line-height-caption1)",
      }}
    >
      {children}
    </span>
  );
}

function SixCells({
  size,
  disabled,
}: {
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}) {
  const [value, setValue] = useState(disabled ? "123456" : "");
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onValueChange={setValue}
      size={size}
      disabled={disabled}
      aria-label="Verification code"
    >
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTP>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: spacings.sizeXSmall,
      }}
    >
      <DemoLabel>{label}</DemoLabel>
      {children}
    </div>
  );
}

export default function InputOTPDemo() {
  return (
    <PreviewFrame minHeight="280px">
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: spacings.sizeXXXLarge,
        }}
      >
        <Row label="Default (lg)">
          <SixCells />
        </Row>
        <Row label="Medium">
          <SixCells size="md" />
        </Row>
        <Row label="Small">
          <SixCells size="sm" />
        </Row>
        <Row label="Disabled">
          <SixCells disabled />
        </Row>
      </div>
    </PreviewFrame>
  );
}

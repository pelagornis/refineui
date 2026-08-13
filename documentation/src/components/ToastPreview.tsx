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
      default: { title: "Toast", description: "Short description appears here." },
      success: { title: "Done", description: "Completed successfully." },
      warning: { title: "Warning", description: "This action cannot be undone." },
      error: { title: "Error", description: "We couldn’t complete the request." },
    } as const;
    const item = map[variant];
    toast(item.title, { variant, description: item.description, action: { ...actionPrimary } });
  };

  const spawnNoAction = () => {
    toast("Saved", { variant: "success", description: "Body only, no action button." });
  };

  const spawnSecondaryAction = () => {
    toast("Moved to trash", {
      variant: "default",
      description: "Secondary (outline) action example.",
      action: { label: "Undo", onClick: () => {}, variant: "secondary" },
    });
  };

  const spawnLongBody = () => {
    toast("Sync", {
      variant: "default",
      description:
        "Long description spanning multiple lines. Card width is fixed at 325px with wrapping body text. The icon slot is vertically centered.",
      action: { label: "Action", onClick: () => {} },
    });
  };

  const spawnStack = () => {
    spawnToast("default");
    globalThis.setTimeout(() => spawnToast("success"), 120);
    globalThis.setTimeout(() => spawnToast("warning"), 240);
  };

  const spawnSpinnerLeading = () => {
    toast("Syncing", {
      variant: "default",
      description: "Leading slot with a Spinner component.",
      icon: <Spinner size="xs" />,
      action: { label: "Cancel", onClick: () => {}, variant: "secondary" },
    });
  };

  const spawnAvatarLeading = () => {
    toast("New message", {
      variant: "default",
      description: "Leading slot with an Avatar component.",
      icon: (
        <Avatar size="xs" aria-hidden>
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
          <p style={sectionLabel}>Type · Inline cards</p>
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
              message="Info tone · default icon"
              action={{ ...actionPrimary }}
            />
            <Toast
              variant="success"
              title="Success"
              message="Success state message"
              action={{ ...actionPrimary }}
            />
            <Toast
              variant="warning"
              title="Warning"
              message="When caution is needed"
              action={{ ...actionPrimary }}
            />
            <Toast variant="error" title="Error" message="Error or failure" action={{ ...actionPrimary }} />
          </div>
        </section>

        <section style={sectionGap}>
          <p style={sectionLabel}>Composition examples</p>
          <div style={{ display: "grid", gap: spacings.sizeLarge, maxWidth: 360 }}>
            <Toast variant="default" title="Title only" />
            <Toast
              variant="success"
              title="No action"
              message="Body only without a right-side button."
            />
            <Toast
              variant="default"
              title="Custom icon"
              message="The icon prop overrides the leading slot."
              icon={<WebIcon name="mail" size={iconSizes.medium} color={colors.primaryBlack} aria-hidden />}
              action={{ ...actionPrimary }}
            />
          </div>
        </section>

        <section style={sectionGap}>
          <p style={sectionLabel}>Leading · Spinner / Avatar</p>
          <p style={mutedBody}>
            You can pass package components such as <code>Spinner</code> or <code>Avatar</code> to the{" "}
            <code>icon</code> prop for the Toast / Icon slot.
          </p>
          <div style={{ display: "grid", gap: spacings.sizeLarge, maxWidth: 360 }}>
            <Toast
              variant="default"
              title="Processing"
              message="Loading — Spinner (xs) on the left."
              icon={<Spinner size="xs" />}
              action={{ label: "Cancel", onClick: () => {}, variant: "secondary" }}
            />
            <Toast
              variant="default"
              title="Notification"
              message="Sender — Avatar fits the slot at xsmall (24px)."
              icon={
                <Avatar size="xs" color="blue" alt="Kim Min" aria-hidden />
              }
              action={{ ...actionPrimary }}
            />
            <Toast
              variant="default"
              title="Mention"
              message="Image Avatar + AvatarImage."
              icon={
                <Avatar size="xs" aria-hidden>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/9919?s=80&v=4" alt="" />
                </Avatar>
              }
              action={{ ...actionPrimary }}
            />
          </div>
        </section>

        <section style={sectionGap}>
          <p style={sectionLabel}>toast() · Portal & stack</p>
          <p style={mutedBody}>
            Use <code>Toaster</code> <code>position</code> to change the viewport anchor.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: spacings.sizeXSmall,
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeXSmall }}>
              <Button variant="primary" size="sm" onClick={() => spawnToast("default")}>
                Default
              </Button>
              <Button variant="secondary" size="sm" onClick={() => spawnToast("success")}>
                Success
              </Button>
              <Button variant="outline" size="sm" onClick={() => spawnToast("warning")}>
                Warning
              </Button>
              <Button variant="ghost" size="sm" onClick={() => spawnToast("error")}>
                Error
              </Button>
              <Button variant="outline" size="sm" onClick={spawnNoAction}>
                No action
              </Button>
              <Button variant="outline" size="sm" onClick={spawnSecondaryAction}>
                Secondary action
              </Button>
              <Button variant="outline" size="sm" onClick={spawnLongBody}>
                Long body
              </Button>
              <Button variant="secondary" size="sm" onClick={spawnStack}>
                Stack ×3
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

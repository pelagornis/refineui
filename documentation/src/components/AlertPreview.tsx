import { spacings, iconSizes, colors } from "@refineui/tokens";
import { Alert, AlertDescription, AlertTitle, WebIcon } from "@refineui/react";

import PreviewFrame from "./PreviewFrame";

export default function AlertPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "grid", width: "100%", maxWidth: 720, alignItems: "start", gap: spacings.sizeXLarge }}>
        <section style={{ display: "grid", gap: spacings.sizeMedium }}>
          <p className="refineui-typo-caption-1 m-0 text-refineui-neutral-600">Composed API</p>
          <Alert variant="default">
            <WebIcon name="circle" size={iconSizes.medium} color={colors.primaryBlack} aria-hidden />
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description — 기본(neutral) 톤, 제목 검정·본문 보조색.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <WebIcon name="checkmark" size={iconSizes.medium} color={colors.green700} aria-hidden />
            <AlertTitle>Payment successful</AlertTitle>
            <AlertDescription>
              Your payment of $29.99 has been processed. A receipt has been sent to your email address.
            </AlertDescription>
          </Alert>
          <Alert variant="info">
            <WebIcon name="info" size={iconSizes.medium} color={colors.blue700} aria-hidden />
            <AlertTitle>New feature available</AlertTitle>
            <AlertDescription>
              We&apos;ve added dark mode support. You can enable it in your account settings.
            </AlertDescription>
          </Alert>
        </section>

        <section style={{ display: "grid", gap: spacings.sizeMedium }}>
          <p className="refineui-typo-caption-1 m-0 text-refineui-neutral-600">Variant API</p>
          <Alert variant="default" title="Alert Title" description="Alert Description" />
          <Alert variant="success" title="Deploy completed" description="Your production deployment finished successfully." />
          <Alert variant="warning" title="High memory usage" description="The current process is using more memory than usual." />
          <Alert variant="danger" title="Payment failed" description="Please update your card details and try again." />
        </section>

        <section style={{ display: "grid", gap: spacings.sizeMedium }}>
          <p className="refineui-typo-caption-1 m-0 text-refineui-neutral-600">Close + Actions</p>
          <Alert
            variant="info"
            title="Changes available"
            description="A new version is ready. Review the release notes before updating."
            onClose={() => {}}
            actions={[
              { label: "Later", onClick: () => {} },
              { label: "Update", onClick: () => {} },
            ]}
          />
        </section>

        <section style={{ display: "grid", gap: spacings.sizeMedium }}>
          <p className="refineui-typo-caption-1 m-0 text-refineui-neutral-600">Custom icon node</p>
          <Alert
            variant="custom"
            title="Custom integration"
            description="You can provide any ReactNode as the leading icon."
            icon={<WebIcon name="star" size={iconSizes.medium} color={colors.purple1000} aria-hidden />}
          />
        </section>
      </div>
    </PreviewFrame>
  );
}

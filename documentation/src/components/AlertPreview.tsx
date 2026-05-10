import { spacings, iconSizes, colors } from "@refineui/tokens";
import {
  Alert,
  AlertAction,
  AlertActions,
  AlertBody,
  AlertClose,
  AlertDescription,
  AlertIcon,
  AlertRow,
  AlertTitle,
  WebIcon,
} from "@refineui/react";

import PreviewFrame from "./PreviewFrame";

export default function AlertPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "grid", width: "100%", maxWidth: 720, alignItems: "start", gap: spacings.sizeXLarge }}>
        <section style={{ display: "grid", gap: spacings.sizeMedium }}>
          <p className="refineui-typo-caption-1 m-0 text-refineui-neutral-600">Composed API</p>
          <Alert variant="default">
            <AlertRow>
              <AlertIcon>
                <WebIcon name="circle" size={iconSizes.medium} color={colors.primaryBlack} aria-hidden />
              </AlertIcon>
              <AlertBody>
                <AlertTitle>Alert Title</AlertTitle>
                <AlertDescription>
                  Alert description — default (neutral) tone; title uses primary ink and body uses secondary.
                </AlertDescription>
              </AlertBody>
            </AlertRow>
          </Alert>
          <Alert variant="success">
            <AlertRow>
              <AlertIcon>
                <WebIcon name="checkmark" size={iconSizes.medium} color={colors.green700} aria-hidden />
              </AlertIcon>
              <AlertBody>
                <AlertTitle>Payment successful</AlertTitle>
                <AlertDescription>
                  Your payment of $29.99 has been processed. A receipt has been sent to your email address.
                </AlertDescription>
              </AlertBody>
            </AlertRow>
          </Alert>
          <Alert variant="info">
            <AlertRow>
              <AlertIcon>
                <WebIcon name="info" size={iconSizes.medium} color={colors.blue700} aria-hidden />
              </AlertIcon>
              <AlertBody>
                <AlertTitle>New feature available</AlertTitle>
                <AlertDescription>
                  We&apos;ve added dark mode support. You can enable it in your account settings.
                </AlertDescription>
              </AlertBody>
            </AlertRow>
          </Alert>
        </section>

        <section style={{ display: "grid", gap: spacings.sizeMedium }}>
          <p className="refineui-typo-caption-1 m-0 text-refineui-neutral-600">Close + Actions</p>
          <Alert variant="info">
            <AlertRow>
              <AlertIcon name="info" />
              <AlertBody>
                <AlertTitle>Changes available</AlertTitle>
                <AlertDescription>A new version is ready. Review the release notes before updating.</AlertDescription>
              </AlertBody>
              <AlertClose onClick={() => {}} />
            </AlertRow>
            <AlertActions>
              <AlertAction onClick={() => {}}>Later</AlertAction>
              <AlertAction onClick={() => {}}>Update</AlertAction>
            </AlertActions>
          </Alert>
        </section>

        <section style={{ display: "grid", gap: spacings.sizeMedium }}>
          <p className="refineui-typo-caption-1 m-0 text-refineui-neutral-600">Custom icon node</p>
          <Alert variant="custom">
            <AlertRow>
              <AlertIcon>
                <WebIcon name="star" size={iconSizes.medium} color={colors.purple1000} aria-hidden />
              </AlertIcon>
              <AlertBody>
                <AlertTitle>Custom integration</AlertTitle>
                <AlertDescription>You can provide any ReactNode as the leading icon.</AlertDescription>
              </AlertBody>
            </AlertRow>
          </Alert>
        </section>
      </div>
    </PreviewFrame>
  );
}

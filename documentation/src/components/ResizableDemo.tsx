import { spacings } from "@refineui/tokens";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

function PanelLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: spacings.sizeLarge,
        background: "var(--refineui-color-alias-background-surface)",
      }}
    >
      <span
        className="refineui-typo-body-3"
        style={{ color: "var(--refineui-color-alias-foreground-secondary)" }}
      >
        {children}
      </span>
    </div>
  );
}

export default function ResizableDemo() {
  return (
    <PreviewFrame minHeight="420px">
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "640px",
          flexDirection: "column",
          gap: spacings.sizeXXLarge,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
          <span
            className="refineui-typo-caption-2"
            style={{
              color: "var(--refineui-color-alias-foreground-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Horizontal · Tab handle, then ← →
          </span>
          <div
            style={{
              height: "200px",
              overflow: "hidden",
              borderRadius: "var(--refineui-radius-rounded-x-large)",
              border:
                "var(--refineui-stroke-width-thin) solid var(--refineui-color-alias-border-default)",
              boxShadow: "var(--refineui-shadow-2)",
            }}
          >
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize={35} minSize={20}>
                <PanelLabel>Sidebar</PanelLabel>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={65} minSize={30}>
                <PanelLabel>Main</PanelLabel>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
          <span
            className="refineui-typo-caption-2"
            style={{
              color: "var(--refineui-color-alias-foreground-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Nested
          </span>
          <div
            style={{
              height: "260px",
              overflow: "hidden",
              borderRadius: "var(--refineui-radius-rounded-x-large)",
              border:
                "var(--refineui-stroke-width-thin) solid var(--refineui-color-alias-border-default)",
              boxShadow: "var(--refineui-shadow-2)",
            }}
          >
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize={40} minSize={20}>
                <PanelLabel>Left</PanelLabel>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={60} minSize={30}>
                <ResizablePanelGroup orientation="vertical">
                  <ResizablePanel defaultSize={45} minSize={20}>
                    <PanelLabel>Top</PanelLabel>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={55} minSize={20}>
                    <PanelLabel>Bottom</PanelLabel>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

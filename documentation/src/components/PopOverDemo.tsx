import {
  Button,
  componentSizes,
  Field,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@refineui/react";
import { spacings } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

/** 합성 Popover API + Preview 영역 확보 (`minWidth` / `minHeight`) */
export default function PopOverDemo() {
  return (
    <PreviewFrame minHeight="min(560px, 70vh)" minWidth="480px">
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, alignItems: "flex-start" }}>
        <Popover>
          <PopoverTrigger>
            <Button variant="secondary">Dimensions</Button>
          </PopoverTrigger>
          <PopoverContent
            placement="bottom"
            align="center"
            style={{ width: componentSizes.popoverPanelWidth, maxWidth: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, width: "100%" }}>
              <div>
                <p className="refineui-typo-body-2 font-medium" style={{ margin: 0, marginBottom: spacings.sizeXSmall }}>
                  Dimensions
                </p>
                <p
                  className="refineui-typo-caption-1"
                  style={{
                    margin: 0,
                    color: "var(--refineui-color-neutral-600, #6c6c6c)",
                  }}
                >
                  레이어 크기를 설정합니다. (Web Kit PopOver · 합성 API)
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium, width: "100%" }}>
                <Field label="Width" size="sm">
                  <Input id="popover-width" size="sm" defaultValue="100%" fullWidth />
                </Field>
                <Field label="Max. width" size="sm">
                  <Input id="popover-max-w" size="sm" defaultValue="300px" fullWidth />
                </Field>
                <Field label="Height" size="sm">
                  <Input id="popover-height" size="sm" defaultValue="25px" fullWidth />
                </Field>
                <Field label="Max. height" size="sm">
                  <Input id="popover-max-h" size="sm" defaultValue="none" fullWidth />
                </Field>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger>
            <Button variant="primary">Inverted 패널</Button>
          </PopoverTrigger>
          <PopoverContent variant="inverted" placement="bottom" align="start">
            <div style={{ padding: spacings.sizeSmall }}>variant=&quot;inverted&quot; 예시</div>
          </PopoverContent>
        </Popover>
      </div>
    </PreviewFrame>
  );
}

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@refineui/react";
import { borderRadii, colors, spacings, strokeWidths, typographys } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

/** Preview stage — Dialog shell portals to `document.body` only */
export default function DialogDemo() {
    const [openSm, setOpenSm] = useState(false);
    return (
        <PreviewFrame>
            <div
                data-dialog-demo-stage
                style={{
                    width: "100%",
                    minHeight: "min(52vh, 440px)",
                    boxSizing: "border-box",
                    padding: spacings.sizeLarge,
                    borderRadius: borderRadii.roundedMedium,
                    border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                    backgroundColor: colors.neutralWhite,
                }}
            >
                <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeSmall }}>
                    <Dialog>
                        <DialogTrigger type="button">Open dialog (Large)</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Dialog title</DialogTitle>
                                <DialogDescription>Large width (600px) body copy.</DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={openSm} onOpenChange={setOpenSm} size="sm">
                        <DialogTrigger type="button" variant="secondary">
                            Open dialog (Small)
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Small title</DialogTitle>
                                <DialogDescription>Narrow width (300px) example.</DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                <p
                    style={{
                        marginTop: spacings.sizeMedium,
                        marginBottom: 0,
                        maxWidth: "42rem",
                        ...typographys.body4,
                        color: colors.neutral600,
                    }}
                >
                    When open, the scrim and panel render over the <strong>full page</strong>, not inside the preview
                    box. Press ESC or click the backdrop to close.
                </p>
            </div>
        </PreviewFrame>
    );
}

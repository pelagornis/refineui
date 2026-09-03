import { Button, Toaster, toast } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function ToastPreview() {
    return (
        <Looks>
            <Look>
                <Toaster />
                <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                        toast("Saved successfully", {
                            variant: "success",
                        })
                    }
                >
                    Show toast
                </Button>
            </Look>
        </Looks>
    );
}

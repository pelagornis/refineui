import { Button, Toaster, toast } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function ToastPreview() {
    return (
        <Looks>
            <Look>
                <Toaster position="top-center" />
                <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                        toast("Done", {
                            variant: "success",
                            description: "Completed successfully.",
                        })
                    }
                >
                    Show toast
                </Button>
            </Look>
        </Looks>
    );
}

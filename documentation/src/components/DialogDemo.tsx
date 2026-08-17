import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function DialogDemo() {
    return (
        <Looks>
            <Look>
                <Dialog>
                    <DialogTrigger type="button">Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Dialog title</DialogTitle>
                            <DialogDescription>Large width body copy.</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </Look>
        </Looks>
    );
}

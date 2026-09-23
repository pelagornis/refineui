import { useState } from "react";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    Text,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function DrawerDemo() {
    const [open, setOpen] = useState(false);

    return (
        <Looks>
            <Look>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger type="button">Open</DrawerTrigger>
                    <DrawerContent type="overlay" size="sm" placement="right">
                        <DrawerHeader>
                            <DrawerTitle>Drawer title</DrawerTitle>
                            <DrawerDescription>Supporting copy</DrawerDescription>
                        </DrawerHeader>
                        <DrawerBody>
                            <Text as="p" variant="bodyMd" className="m-0">
                                Drawer content
                            </Text>
                        </DrawerBody>
                        <DrawerFooter state="split">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="button">Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Look>
        </Looks>
    );
}

import {
    Button,
    Drawer,
    DrawerBody,
    DrawerClose,
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
    return (
        <Looks>
            <Look>
                <Drawer>
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
                            <DrawerClose variant="outline">Cancel</DrawerClose>
                            <Button type="button">Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Look>
        </Looks>
    );
}

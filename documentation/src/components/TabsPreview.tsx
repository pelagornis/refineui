import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function TabsPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <Text as="p" variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                            12 active projects
                        </Text>
                    </TabsContent>
                    <TabsContent value="analytics">
                        <Text as="p" variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                            Views up 25%
                        </Text>
                    </TabsContent>
                    <TabsContent value="reports">
                        <Text as="p" variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                            5 reports ready
                        </Text>
                    </TabsContent>
                    <TabsContent value="settings">
                        <Text as="p" variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                            Notifications and security
                        </Text>
                    </TabsContent>
                </Tabs>
            </Look>
        </Looks>
    );
}

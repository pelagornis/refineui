import { useState } from "react";
import { spacings } from "@refineui/tokens";
import {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardHeaderMain,
    CardTitle,
    WebIcon,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function CardPreview() {
    const [selected1, setSelected1] = useState(false);
    const [selected2, setSelected2] = useState(false);

    const articleCard = (className?: string, interactive = false) => (
        <Card variant="elevated" interactive={interactive} className={className}>
            <CardHeader>
                <CardHeaderMain>
                    <CardTitle>RefineUI is now available</CardTitle>
                    <CardDescription>7 hours ago by Pelagornis Inc</CardDescription>
                </CardHeaderMain>
                <CardAction>
                    <Button variant="ghost" size="sm" layout="icon" aria-label="More actions">
                        <WebIcon name="more-horizontal" size={20} color="currentColor" />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p className="m-0 refineui-typo-caption-2 text-refineui-alias-foreground-primary">
                    RefineUI web represents a collection of utilities, React components, and web
                    components for building web applications.
                </p>
            </CardContent>
            <CardFooter className="flex-row justify-end gap-refineui-size-small">
                <Button type="button" size="sm" variant="primary">
                    Confirm
                </Button>
                <Button type="button" size="sm" variant="outline">
                    Cancel
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <PreviewFrame>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: spacings.sizeXXLarge,
                    width: "100%",
                    maxWidth: "800px",
                }}
            >
                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Appearance
                    </h4>
                    <div className="grid gap-refineui-size-large md:grid-cols-2">
                        {articleCard("w-full", false)}
                        {articleCard("w-full border-refineui-thick border-refineui-alias-border-focus", true)}
                        <Card variant="outlined" className="w-full">
                            <CardContent className="py-refineui-size-large">
                                <p className="m-0 refineui-typo-body-2 text-refineui-alias-foreground-secondary">
                                    Outlined card
                                </p>
                            </CardContent>
                        </Card>
                        <Card
                            variant="outlined"
                            className="w-full border-transparent bg-transparent shadow-none"
                        >
                            <CardContent className="py-refineui-size-large">
                                <p className="m-0 refineui-typo-body-2 text-refineui-alias-foreground-secondary">
                                    Subtle style (배경/테두리 최소화)
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Selectable
                    </h4>
                    <div className="grid gap-refineui-size-large md:grid-cols-2">
                        <div onClick={() => setSelected1((v) => !v)} className="cursor-pointer">
                            {articleCard(
                                `w-full ${selected1 ? "border-refineui-thick border-refineui-alias-border-focus" : ""}`,
                                true,
                            )}
                        </div>
                        <div onClick={() => setSelected2((v) => !v)} className="cursor-pointer">
                            {articleCard(
                                `w-full ${selected2 ? "border-refineui-thick border-refineui-alias-border-focus" : ""}`,
                                true,
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </PreviewFrame>
    );
}

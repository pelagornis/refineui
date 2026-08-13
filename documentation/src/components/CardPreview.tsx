import { useState } from "react";
import { spacings } from "@refineui/tokens";
import {
    Avatar,
    Badge,
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

function FeatureCard({
    selected,
    onSelect,
}: {
    selected?: boolean;
    onSelect?: () => void;
}) {
    const interactive = Boolean(onSelect);
    return (
        <Card
            variant="elevated"
            interactive={interactive}
            className="w-full"
            data-selected={selected ? "true" : undefined}
            aria-pressed={interactive ? selected : undefined}
            onClick={onSelect}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={
                interactive
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onSelect?.();
                          }
                      }
                    : undefined
            }
        >
            <CardHeader>
                <CardHeaderMain>
                    <div className="mb-refineui-size-xx-small flex items-center gap-refineui-size-x-small">
                        <Badge variant="default">New</Badge>
                        <span className="refineui-typo-caption-2 text-refineui-alias-foreground-tertiary">
                            Design system
                        </span>
                    </div>
                    <CardTitle>RefineUI is now available</CardTitle>
                    <CardDescription>Ship product UI with tokens, React, and Web Kit parity.</CardDescription>
                </CardHeaderMain>
                <CardAction>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        layout="icon"
                        aria-label="More actions"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <WebIcon name="more-horizontal" size={20} color="currentColor" />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-refineui-size-medium">
                    <p className="m-0 refineui-typo-body-2 text-refineui-alias-foreground-secondary">
                        Utilities, React components, and shared foundations for building consistent web
                        applications—without reinventing spacing, color, or motion.
                    </p>
                    <div className="flex items-center gap-refineui-size-x-small">
                        <Avatar size="xs" color="blue" alt="Pelagornis" />
                        <span className="refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
                            Pelagornis Inc · 7 hours ago
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(e) => e.stopPropagation()}
                >
                    Learn more
                </Button>
                <Button type="button" size="sm" variant="primary" onClick={(e) => e.stopPropagation()}>
                    Get started
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function CardPreview() {
    const [selected1, setSelected1] = useState(true);
    const [selected2, setSelected2] = useState(false);

    return (
        <PreviewFrame>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: spacings.sizeXXLarge,
                    width: "100%",
                    maxWidth: "880px",
                }}
            >
                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Elevated
                    </h4>
                    <p className="m-0 refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
                        Shadow 4 · no border · header / content / footer slots
                    </p>
                    <div className="grid items-stretch gap-refineui-size-large lg:grid-cols-2">
                        <FeatureCard />
                        <Card variant="elevated" className="w-full">
                            <CardHeader>
                                <CardHeaderMain>
                                    <CardTitle>Login to your account</CardTitle>
                                    <CardDescription>
                                        Enter your email below to sign in to your workspace.
                                    </CardDescription>
                                </CardHeaderMain>
                                <CardAction>
                                    <Button type="button" variant="ghost" size="sm">
                                        Sign up
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-refineui-size-small rounded-refineui-large bg-refineui-alias-background-surface px-refineui-size-medium py-refineui-size-medium">
                                    <span className="refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
                                        Workspace
                                    </span>
                                    <span className="refineui-typo-body-1 text-refineui-alias-foreground-primary">
                                        pelagornis.refineui.dev
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="button" size="sm" variant="outline">
                                    Continue with SSO
                                </Button>
                                <Button type="button" size="sm" variant="primary">
                                    Continue
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Outlined
                    </h4>
                    <p className="m-0 refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
                        Thin border · flat surface — denser lists and settings
                    </p>
                    <div className="grid items-stretch gap-refineui-size-medium md:grid-cols-3">
                        {(
                            [
                                { title: "Tokens", body: "Color, space, type, motion" },
                                { title: "React", body: "Composable Web Kit components" },
                                { title: "Docs", body: "Patterns and live previews" },
                            ] as const
                        ).map((item) => (
                            <Card key={item.title} variant="outlined" className="w-full">
                                <CardHeader>
                                    <CardHeaderMain>
                                        <CardTitle className="refineui-typo-sub-title-1">{item.title}</CardTitle>
                                        <CardDescription>{item.body}</CardDescription>
                                    </CardHeaderMain>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Selectable
                    </h4>
                    <p className="m-0 refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
                        Interactive cards — click to toggle selection (`data-selected`)
                    </p>
                    <div className="grid items-stretch gap-refineui-size-large lg:grid-cols-2">
                        <FeatureCard selected={selected1} onSelect={() => setSelected1((v) => !v)} />
                        <FeatureCard selected={selected2} onSelect={() => setSelected2((v) => !v)} />
                    </div>
                </section>
            </div>
        </PreviewFrame>
    );
}

import { iconSizes } from "@refineui/tokens";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    WebIcon,
} from "@refineui/react";
import {
    accordionItemOpenClass,
    accordionStyles,
    contentTypo,
    triggerTypo,
} from "../../../packages/react/src/components/Accordion/style";
import { Look, Looks } from "./PreviewFrame";

const card = `flex flex-col rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default ${accordionItemOpenClass} px-refineui-size-large py-refineui-size-small`;

export default function CollapsiblePreview() {
    return (
        <Looks>
            <Look>
                <Collapsible
                    defaultOpen
                    className="flex w-full max-w-sm flex-col gap-refineui-size-small text-refineui-alias-foreground-primary"
                    style={{ width: 350 }}
                >
                    <div className="flex items-center justify-between gap-refineui-size-large px-refineui-size-large">
                        <h4 className={triggerTypo.md}>Order #4189</h4>
                        <CollapsibleTrigger
                            layout="icon"
                            size="sm"
                            aria-label="Toggle details"
                            className="group"
                        >
                            <WebIcon
                                name="chevron-down"
                                size={iconSizes.small}
                                color="currentColor"
                                fallback="▼"
                                className={`${accordionStyles.chevron} group-data-[state=open]:rotate-180`}
                            />
                        </CollapsibleTrigger>
                    </div>
                    <div className={`${card} flex-row items-center justify-between`}>
                        <span className={`${contentTypo.md} text-refineui-alias-foreground-secondary`}>Status</span>
                        <span className={contentTypo.md}>Shipped</span>
                    </div>
                    <CollapsibleContent>
                        <div className="flex flex-col gap-refineui-size-small">
                            <div className={card}>
                                <p className={contentTypo.md}>Shipping address</p>
                                <p className={`${contentTypo.md} text-refineui-alias-foreground-tertiary`}>
                                    100 Market St, San Francisco
                                </p>
                            </div>
                            <div className={card}>
                                <p className={contentTypo.md}>Items</p>
                                <p className={`${contentTypo.md} text-refineui-alias-foreground-tertiary`}>
                                    2x Studio Headphones
                                </p>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </Look>
        </Looks>
    );
}

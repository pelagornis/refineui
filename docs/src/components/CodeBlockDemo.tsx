import { useState } from "react";
import {
    Button,
    CodeBlock,
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockLine,
    CodeBlockTitle,
    WebIcon,
} from "@refineui/react";
import { iconSizes } from "@refineui/tokens";
import { Look, Looks } from "./PreviewFrame";

const source = `export async function POST(request: Request) {
  const { messages } = await request.json();

  return Response.json({ messages });
}`;

function downloadSource() {
    const url = URL.createObjectURL(new Blob([source], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "route.ts";
    link.click();
    URL.revokeObjectURL(url);
}

export default function CodeBlockDemo() {
    const [wrap, setWrap] = useState(false);
    return (
        <Looks>
            <Look align="stretch" width="wide">
                <CodeBlock className="w-full">
                    <CodeBlockHeader>
                        <CodeBlockTitle title="app/api/chat/route.ts">
                            <WebIcon name="document" size={iconSizes.small} color="currentColor" fallback="{}" aria-hidden />
                            app/api/chat/route.ts
                        </CodeBlockTitle>
                        <CodeBlockActions>
                            <Button
                                variant="ghost"
                                size="sm"
                                layout="icon"
                                aria-label="Wrap lines"
                                aria-pressed={wrap}
                                title="Wrap lines"
                                onClick={() => setWrap((current) => !current)}
                            >
                                <WebIcon name="text" size={iconSizes.small} color="currentColor" fallback="↔" aria-hidden />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                layout="icon"
                                aria-label="Download source"
                                title="Download source"
                                onClick={downloadSource}
                            >
                                <WebIcon name="save" size={iconSizes.small} color="currentColor" fallback="↓" aria-hidden />
                            </Button>
                            <CodeBlockCopyButton value={source} />
                        </CodeBlockActions>
                    </CodeBlockHeader>
                    <CodeBlockContent wrap={wrap} lineNumbers>
                        <CodeBlockLine>
                            <span className="text-refineui-alias-foreground-info">export async function</span>{" "}
                            <span className="text-refineui-alias-foreground-discovery">POST</span>
                            <span>(request: Request) {'{'}</span>
                        </CodeBlockLine>
                        <CodeBlockLine>
                            {"  "}<span className="text-refineui-alias-foreground-info">const</span>{" { messages } = "}
                            <span className="text-refineui-alias-foreground-info">await</span>{" request."}
                            <span className="text-refineui-alias-foreground-discovery">json</span><span>();</span>
                        </CodeBlockLine>
                        <CodeBlockLine> </CodeBlockLine>
                        <CodeBlockLine variant="highlighted">
                            {"  "}<span className="text-refineui-alias-foreground-info">return</span>{" Response."}
                            <span className="text-refineui-alias-foreground-discovery">json</span>
                            <span>({'{'} messages {'}'});</span>
                        </CodeBlockLine>
                        <CodeBlockLine>{'}'}</CodeBlockLine>
                    </CodeBlockContent>
                </CodeBlock>
            </Look>
        </Looks>
    );
}

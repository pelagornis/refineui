import { zIndex } from "@refineui/tokens";
import PreviewFrame from "../PreviewFrame";
import { TokenRow, TokenTable } from "./TokenMeta";

export function ZIndexPreview() {
    return (
        <PreviewFrame>
            <TokenTable>
            {(Object.keys(zIndex) as (keyof typeof zIndex)[]).map((key) => (
                <TokenRow key={key} name={key} value={zIndex[key]} />
            ))}
            </TokenTable>
        </PreviewFrame>
    );
}

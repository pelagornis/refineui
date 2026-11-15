import { Result, ResultButton } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function ResultDemo() {
    return <Looks><Look align="stretch"><Result variant="error" title="Try again" description="We couldn't load this screen. Please check your connection and try again." actions={<ResultButton>Try again</ResultButton>} /></Look></Looks>;
}

import { clsx } from "clsx";
import { messageStyles } from "./style";
import type {
    MessageAlign,
    MessageAvatarProps,
    MessageContentProps,
    MessageFooterProps,
    MessageProps,
} from "./types";

/** Conversation row primitive. Compose with Avatar and Bubble rather than embedding application content. */
export function Message({ align = "start", className, ...props }: MessageProps) {
    return (
        <div
            data-refineui="message"
            data-align={align}
            className={clsx(messageStyles.root, className)}
            {...props}
        />
    );
}

/** Avatar slot for a Message row. Compose with Avatar. */
export function MessageAvatar({ className, ...props }: MessageAvatarProps) {
    return <div data-refineui="message-avatar" className={clsx(messageStyles.avatar, className)} {...props} />;
}

/** Content column for one or more Bubble instances and optional message metadata. */
export function MessageContent({ className, ...props }: MessageContentProps) {
    return <div data-refineui="message-content" className={clsx(messageStyles.content, className)} {...props} />;
}

/** Delivery state, timestamp, or other secondary message metadata. */
export function MessageFooter({ className, ...props }: MessageFooterProps) {
    return <div data-refineui="message-footer" className={clsx(messageStyles.footer, className)} {...props} />;
}

export type { MessageAlign };

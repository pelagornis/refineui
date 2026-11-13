import type { HTMLAttributes } from "react";
import type { BubbleAlign } from "../Bubble";

export type MessageAlign = BubbleAlign;

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
    /** Places the avatar and message content at the conversation start or end. */
    align?: MessageAlign;
}

export type MessageAvatarProps = HTMLAttributes<HTMLDivElement>;
export type MessageContentProps = HTMLAttributes<HTMLDivElement>;
export type MessageFooterProps = HTMLAttributes<HTMLDivElement>;

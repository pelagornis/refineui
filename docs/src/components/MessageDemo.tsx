import {
    Avatar,
    AvatarFallback,
    Bubble,
    BubbleContent,
    BubbleGroup,
    BubbleReactions,
    Message,
    MessageAvatar,
    MessageContent,
    MessageFooter,
    Stack,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function MessageDemo() {
    return (
        <Looks>
            <Look align="stretch">
                <Stack gap="sizeLarge" className="w-full">
                    <Message align="end">
                        <MessageAvatar>
                            <Avatar alt="Me"><AvatarFallback>ME</AvatarFallback></Avatar>
                        </MessageAvatar>
                        <MessageContent>
                            <Bubble align="end"><BubbleContent>Deploying to prod real quick.</BubbleContent></Bubble>
                        </MessageContent>
                    </Message>
                    <Message>
                        <MessageAvatar>
                            <Avatar alt="Rabbit"><AvatarFallback>R</AvatarFallback></Avatar>
                        </MessageAvatar>
                        <MessageContent>
                            <Bubble variant="muted"><BubbleContent>It&apos;s 4:55 PM. On a Friday.</BubbleContent></Bubble>
                        </MessageContent>
                    </Message>
                    <Message align="end">
                        <MessageAvatar>
                            <Avatar alt="Me"><AvatarFallback>ME</AvatarFallback></Avatar>
                        </MessageAvatar>
                        <MessageContent>
                            <Bubble align="end"><BubbleContent>It&apos;s a one-line change.</BubbleContent></Bubble>
                            <MessageFooter>Delivered</MessageFooter>
                        </MessageContent>
                    </Message>
                    <Message>
                        <MessageAvatar>
                            <Avatar alt="Rabbit"><AvatarFallback>R</AvatarFallback></Avatar>
                        </MessageAvatar>
                        <MessageContent>
                            <BubbleGroup>
                                <Bubble variant="muted"><BubbleContent>It&apos;s always a one-line change.</BubbleContent></Bubble>
                                <Bubble variant="muted">
                                    <BubbleContent>Alright, let me take a look.</BubbleContent>
                                    <BubbleReactions aria-label="Reaction: thumbs up"><span aria-hidden>👍</span></BubbleReactions>
                                </Bubble>
                            </BubbleGroup>
                        </MessageContent>
                    </Message>
                </Stack>
            </Look>
        </Looks>
    );
}

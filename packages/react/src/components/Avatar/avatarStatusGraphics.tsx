import type { SVGProps } from "react";
import { useId } from "react";
import { clsx } from "clsx";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";

/**
 * Web Kit `Avatar/Status` `65:65` — Figma SVG 내보내기 (14×14)와 동일 실루엣.
 * 색은 Foundation 토큰 CSS 변수 (`colors.ts`와 동일 hex).
 */
export type AvatarStatusGraphicStatus = "online" | "away" | "unavailable" | "offline";

type Props = {
    status: AvatarStatusGraphicStatus;
} & Omit<SVGProps<SVGSVGElement>, "children" | "viewBox">;

export function AvatarStatusGraphic({ status, className, ...props }: Props) {
    const uid = useId().replace(/:/g, "");
    const clipId = `avatar-status-clip-${uid}`;
    const cn = clsx("size-full shrink-0", className);

    switch (status) {
        case "online":
            return (
                <svg viewBox="0 0 14 14" className={cn} aria-hidden {...props}>
                    <g clipPath={`url(#${clipId}-online)`}>
                        <circle cx="7" cy="7" r="7" fill={resolveColorTokenValue(componentColorTokens.avatar.status.online)} />
                    </g>
                    <defs>
                        <clipPath id={`${clipId}-online`}>
                            <rect width="14" height="14" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            );
        case "away":
            return (
                <svg viewBox="0 0 14 14" className={cn} aria-hidden {...props}>
                    <g clipPath={`url(#${clipId}-away)`}>
                        <path
                            d="M8.92116 0C11.8596 0.889805 14 3.61568 14 6.84512C14 10.7966 10.7972 14 6.84631 14C3.61717 14 0.889453 11.8596 0 8.92031C0.657662 9.11969 1.35442 9.23008 2.07718 9.23008C6.02805 9.23008 9.23087 6.02673 9.23087 2.0752C9.23087 1.3531 9.12008 0.657147 8.92116 0Z"
                            fill={resolveColorTokenValue(componentColorTokens.avatar.status.away)}
                        />
                    </g>
                    <defs>
                        <clipPath id={`${clipId}-away`}>
                            <rect width="14" height="14" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            );
        case "unavailable":
            return (
                <svg viewBox="0 0 14 14" className={cn} aria-hidden {...props}>
                    <g clipPath={`url(#${clipId}-unav)`}>
                        <path
                            d="M14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7Z"
                            fill={resolveColorTokenValue(componentColorTokens.avatar.status.unavailable.background)}
                        />
                        <path
                            d="M2.33333 7C2.33333 6.35567 2.85567 5.83333 3.5 5.83333H10.5C11.1443 5.83333 11.6667 6.35567 11.6667 7C11.6667 7.64433 11.1443 8.16667 10.5 8.16667H3.5C2.85567 8.16667 2.33333 7.64433 2.33333 7Z"
                            fill={resolveColorTokenValue(componentColorTokens.avatar.status.unavailable.mark)}
                        />
                    </g>
                    <defs>
                        <clipPath id={`${clipId}-unav`}>
                            <rect width="14" height="14" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            );
        case "offline":
            return (
                <svg viewBox="0 0 14 14" className={cn} aria-hidden {...props}>
                    <g clipPath={`url(#${clipId}-off)`}>
                        <circle cx="7" cy="7" r="7" fill={resolveColorTokenValue(componentColorTokens.avatar.status.offline)} />
                    </g>
                    <defs>
                        <clipPath id={`${clipId}-off`}>
                            <rect width="14" height="14" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            );
    }
}

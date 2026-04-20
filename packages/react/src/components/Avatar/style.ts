export const avatarStyles = {
    root: "relative shrink-0",
    image: "size-full object-cover",
    fallback: "inline-flex size-full items-center justify-center",
    text: "inline-flex size-full items-center justify-center",
    badge:
        "pointer-events-none absolute z-refineui-content inline-flex items-center justify-center overflow-hidden rounded-refineui-circle bg-transparent",
    groupRoot: "flex items-center",
    groupCountWrap: "shrink-0",
    groupAvatarWrap: "relative shrink-0",
    groupCount:
        "relative box-border inline-flex items-center justify-center rounded-refineui-circle border-refineui-thin font-medium",
} as const;


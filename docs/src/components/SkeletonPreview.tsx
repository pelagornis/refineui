import { foundationSizes } from "@refineui/tokens";
import { Skeleton, Stack } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function SkeletonPreview() {
    return (
        <Looks>
            <Look>
                <Stack gap="sizeXSmall" style={{ width: foundationSizes.foundationSize3200 }}>
                    <Stack direction="row" gap="sizeMedium" align="center">
                        <Skeleton shape="circle" width={foundationSizes.foundationSize400} />
                        <Stack gap="sizeXSmall" className="min-w-0 flex-1">
                            <Skeleton height={foundationSizes.foundationSize160} />
                            <Skeleton
                                height={foundationSizes.foundationSize120}
                                width={foundationSizes.foundationSize2000}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Look>
        </Looks>
    );
}

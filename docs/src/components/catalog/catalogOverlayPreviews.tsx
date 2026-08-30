import {
    Box,
    Button,
    DropdownGroup,
    DropdownLabel,
    Stack,
    Text,
} from "@refineui/react";

/** Compact open PopOver specimen — stacked panel (catalog canvas). */
export function CatalogPopoverPreview() {
    return (
        <div data-refineui-catalog-overlay data-refineui-catalog-overlay-centered className="w-full">
            <Stack gap="sizeSmall" className="w-refineui-foundation-size-3250 max-w-full items-center">
                <Button type="button" variant="secondary" size="sm">
                    Dimensions
                </Button>
                <Box
                    data-refineui-catalog-popover-panel
                    padding="sizeSmall"
                    background="backgroundPrimary"
                    radius="roundedXXLarge"
                    border="strokeWidthThin"
                    borderColor="borderDefault"
                    className="w-full shadow-refineui-8"
                >
                    <Stack gap="sizeXXSmall">
                        <Text as="p" variant="bodySm" className="m-0">
                            Dimensions
                        </Text>
                        <Text
                            as="p"
                            variant="captionMd"
                            className="m-0 text-refineui-alias-foreground-secondary"
                        >
                            Layer size · Width 100%
                        </Text>
                    </Stack>
                </Box>
            </Stack>
        </div>
    );
}

const dropdownItemClassName =
    "flex w-full cursor-default items-center justify-between gap-refineui-size-x-small rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-left text-refineui-alias-foreground-primary outline-none";

/** Open dropdown panel specimen — inline panel chrome (no portal). */
export function CatalogDropdownPreview() {
    return (
        <div data-refineui-catalog-overlay data-refineui-catalog-overlay-centered className="w-full">
            <Stack gap="sizeSmall" className="w-refineui-foundation-size-3250 max-w-full items-center">
                <Button type="button" variant="secondary" size="sm">
                    Account
                </Button>
                <div
                    data-refineui="dropdown-menu"
                    className="box-border flex w-full min-w-0 flex-col overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary shadow-refineui-2"
                >
                    <div className="box-border flex flex-col gap-px p-refineui-size-xx-small">
                        <DropdownGroup>
                            <DropdownLabel>Account</DropdownLabel>
                            <button
                                type="button"
                                role="menuitem"
                                data-refineui="dropdown-item"
                                data-selected="true"
                                tabIndex={-1}
                                className={dropdownItemClassName}
                            >
                                Profile
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                data-refineui="dropdown-item"
                                tabIndex={-1}
                                className={dropdownItemClassName}
                            >
                                Settings
                            </button>
                        </DropdownGroup>
                        <div
                            role="separator"
                            aria-orientation="horizontal"
                            data-refineui="dropdown-menu-separator"
                            className="flex w-full items-center px-refineui-size-x-small py-refineui-size-xxx-small"
                        >
                            <div className="h-px w-full shrink-0 bg-refineui-alias-border-default" />
                        </div>
                        <button
                            type="button"
                            role="menuitem"
                            data-refineui="dropdown-item"
                            tabIndex={-1}
                            className={dropdownItemClassName}
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </Stack>
        </div>
    );
}

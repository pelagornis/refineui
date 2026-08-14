import { clsx } from "clsx";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type RefObject,
} from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Dialog, DialogContent } from "../Dialog";
import { commandStyles } from "./style";
import type {
    CommandDialogProps,
    CommandEmptyProps,
    CommandFilter,
    CommandGroupHeadingProps,
    CommandGroupProps,
    CommandInputProps,
    CommandItemProps,
    CommandListProps,
    CommandProps,
    CommandSeparatorProps,
    CommandShortcutProps,
} from "./types";

const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

export const defaultCommandFilter: CommandFilter = (value, search, keywords = []) => {
    const query = search.trim().toLowerCase();
    if (!query) return 1;
    const haystack = [value, ...keywords].join(" ").toLowerCase();
    return haystack.includes(query) ? 1 : 0;
};

type ItemRegistration = {
    id: string;
    value: string;
    keywords: string[];
    disabled: boolean;
    forceMount: boolean;
    groupId: string | null;
    nodeRef: RefObject<HTMLButtonElement | null>;
    onSelect?: (value: string) => void;
};

type CommandContextValue = {
    search: string;
    setSearch: (next: string) => void;
    shouldFilter: boolean;
    filter: CommandFilter;
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    listId: string;
    label: string;
    registerItem: (item: ItemRegistration) => () => void;
    getVisibleOrderedIds: () => string[];
    isItemVisible: (id: string) => boolean;
    visibleCount: number;
    selectById: (id: string) => void;
    registerGroup: (groupId: string) => () => void;
    groupHasVisibleItems: (groupId: string) => boolean;
};

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommandContext(component: string): CommandContextValue {
    const ctx = useContext(CommandContext);
    if (!ctx) {
        throw new Error(`${component} must be used within <Command>`);
    }
    return ctx;
}

type GroupContextValue = {
    groupId: string;
};

const CommandGroupContext = createContext<GroupContextValue | null>(null);

function useControllableString(
    controlled: string | undefined,
    defaultValue: string | undefined,
    onChange: ((next: string) => void) | undefined,
): [string, (next: string) => void] {
    const [internal, setInternal] = useState(defaultValue ?? "");
    const isControlled = controlled !== undefined;
    const value = isControlled ? controlled : internal;
    const setValue = useCallback(
        (next: string) => {
            if (!isControlled) setInternal(next);
            onChange?.(next);
        },
        [isControlled, onChange],
    );
    return [value, setValue];
}

export function Command({
    children,
    className,
    value,
    defaultValue,
    onValueChange,
    shouldFilter = true,
    filter = defaultCommandFilter,
    selectedValue: selectedValueProp,
    defaultSelectedValue,
    onSelectedValueChange,
    label = "Command menu",
    onKeyDown,
    ...props
}: CommandProps) {
    const [search, setSearch] = useControllableString(value, defaultValue, onValueChange);
    const [selectedValue, setSelectedValue] = useControllableString(
        selectedValueProp,
        defaultSelectedValue,
        onSelectedValueChange,
    );
    const listId = useId();
    const itemsRef = useRef(new Map<string, ItemRegistration>());
    const groupsRef = useRef(new Set<string>());
    const [registryVersion, setRegistryVersion] = useState(0);

    const bumpRegistry = useCallback(() => {
        setRegistryVersion((v) => v + 1);
    }, []);

    const registerItem = useCallback(
        (item: ItemRegistration) => {
            itemsRef.current.set(item.id, item);
            bumpRegistry();
            return () => {
                itemsRef.current.delete(item.id);
                bumpRegistry();
            };
        },
        [bumpRegistry],
    );

    const registerGroup = useCallback(
        (groupId: string) => {
            groupsRef.current.add(groupId);
            bumpRegistry();
            return () => {
                groupsRef.current.delete(groupId);
                bumpRegistry();
            };
        },
        [bumpRegistry],
    );

    const scoreFor = useCallback(
        (item: ItemRegistration) => {
            if (item.forceMount || !shouldFilter) return 1;
            return filter(item.value, search, item.keywords);
        },
        [filter, search, shouldFilter],
    );

    const getVisibleOrderedIds = useCallback(() => {
        const scored: { id: string; score: number }[] = [];
        for (const item of itemsRef.current.values()) {
            const score = scoreFor(item);
            if (score > 0) scored.push({ id: item.id, score });
        }
        scored.sort((a, b) => b.score - a.score);
        return scored.map((s) => s.id);
    }, [scoreFor, registryVersion]);

    const isItemVisible = useCallback(
        (id: string) => {
            const item = itemsRef.current.get(id);
            if (!item) return false;
            return scoreFor(item) > 0;
        },
        [scoreFor, registryVersion],
    );

    const groupHasVisibleItems = useCallback(
        (groupId: string) => {
            for (const item of itemsRef.current.values()) {
                if (item.groupId === groupId && scoreFor(item) > 0) return true;
            }
            return false;
        },
        [scoreFor, registryVersion],
    );

    const visibleIds = useMemo(() => getVisibleOrderedIds(), [getVisibleOrderedIds]);
    const visibleCount = visibleIds.length;

    const selectById = useCallback(
        (id: string) => {
            const item = itemsRef.current.get(id);
            if (!item || item.disabled) return;
            setSelectedValue(item.value);
            item.onSelect?.(item.value);
        },
        [setSelectedValue],
    );

    useIsomorphicLayoutEffect(() => {
        if (visibleIds.length === 0) {
            if (selectedValue) setSelectedValue("");
            return;
        }
        const stillVisible = [...itemsRef.current.values()].some(
            (item) => item.value === selectedValue && scoreFor(item) > 0 && !item.disabled,
        );
        if (stillVisible) return;
        const firstEnabled = visibleIds
            .map((id) => itemsRef.current.get(id))
            .find((item) => item && !item.disabled);
        if (firstEnabled) setSelectedValue(firstEnabled.value);
    }, [visibleIds, selectedValue, setSelectedValue, scoreFor, search]);

    const moveSelection = useCallback(
        (direction: 1 | -1) => {
            const enabled = visibleIds
                .map((id) => itemsRef.current.get(id))
                .filter((item): item is ItemRegistration => !!item && !item.disabled);
            if (enabled.length === 0) return;
            const currentIndex = enabled.findIndex((item) => item.value === selectedValue);
            const nextIndex =
                currentIndex === -1
                    ? direction === 1
                        ? 0
                        : enabled.length - 1
                    : (currentIndex + direction + enabled.length) % enabled.length;
            const next = enabled[nextIndex];
            if (!next) return;
            setSelectedValue(next.value);
            next.nodeRef.current?.scrollIntoView({ block: "nearest" });
        },
        [visibleIds, selectedValue, setSelectedValue],
    );

    const ctx = useMemo<CommandContextValue>(
        () => ({
            search,
            setSearch,
            shouldFilter,
            filter,
            selectedValue,
            setSelectedValue,
            listId,
            label,
            registerItem,
            getVisibleOrderedIds,
            isItemVisible,
            visibleCount,
            selectById,
            registerGroup,
            groupHasVisibleItems,
        }),
        [
            search,
            setSearch,
            shouldFilter,
            filter,
            selectedValue,
            setSelectedValue,
            listId,
            label,
            registerItem,
            getVisibleOrderedIds,
            isItemVisible,
            visibleCount,
            selectById,
            registerGroup,
            groupHasVisibleItems,
        ],
    );

    return (
        <CommandContext.Provider value={ctx}>
            <div
                data-refineui="command"
                role="presentation"
                className={clsx(commandStyles.root, className)}
                onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
                    onKeyDown?.(event);
                    if (event.defaultPrevented) return;
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        moveSelection(1);
                    } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        moveSelection(-1);
                    } else if (event.key === "Enter") {
                        const active = [...itemsRef.current.values()].find(
                            (item) => item.value === selectedValue && scoreFor(item) > 0,
                        );
                        if (active && !active.disabled) {
                            event.preventDefault();
                            selectById(active.id);
                        }
                    } else if (event.key === "Home") {
                        event.preventDefault();
                        const first = visibleIds
                            .map((id) => itemsRef.current.get(id))
                            .find((item) => item && !item.disabled);
                        if (first) {
                            setSelectedValue(first.value);
                            first.nodeRef.current?.scrollIntoView({ block: "nearest" });
                        }
                    } else if (event.key === "End") {
                        event.preventDefault();
                        const enabled = visibleIds
                            .map((id) => itemsRef.current.get(id))
                            .filter((item): item is ItemRegistration => !!item && !item.disabled);
                        const last = enabled[enabled.length - 1];
                        if (last) {
                            setSelectedValue(last.value);
                            last.nodeRef.current?.scrollIntoView({ block: "nearest" });
                        }
                    }
                }}
                {...props}
            >
                {children}
            </div>
        </CommandContext.Provider>
    );
}

export function CommandDialog({
    children,
    commandProps,
    size = "lg",
    ...dialogProps
}: CommandDialogProps) {
    return (
        <Dialog size={size} {...dialogProps}>
            <DialogContent style={commandStyles.dialogContentPanel} scrollable={false}>
                <Command {...commandProps}>{children}</Command>
            </DialogContent>
        </Dialog>
    );
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
    { className, startIcon, placeholder = "Type a command or search…", disabled, onKeyDown, ...props },
    ref,
) {
    const { search, setSearch, listId, label, selectedValue } = useCommandContext("CommandInput");
    const inputId = useId();

    const activeDescendantId = selectedValue ? `${listId}-item-${cssEscape(selectedValue)}` : undefined;

    return (
        <div data-refineui="command-input" className={commandStyles.inputWrap}>
            <span className={commandStyles.inputIcon} aria-hidden>
                {startIcon ?? (
                    <WebIcon name="search" size={iconSizes.small} color="currentColor" aria-hidden />
                )}
            </span>
            <input
                ref={ref}
                id={inputId}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={activeDescendantId}
                aria-label={label}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                disabled={disabled}
                placeholder={placeholder}
                value={search}
                className={clsx(commandStyles.input, className)}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={onKeyDown}
                {...props}
            />
        </div>
    );
});

export function CommandList({ className, children, ...props }: CommandListProps) {
    const { listId } = useCommandContext("CommandList");
    return (
        <div
            id={listId}
            role="listbox"
            data-refineui="command-list"
            className={clsx(commandStyles.list, className)}
            {...props}
        >
            <div className={commandStyles.listInner}>{children}</div>
        </div>
    );
}

export function CommandEmpty({ className, children = "No results found.", ...props }: CommandEmptyProps) {
    const { visibleCount, search } = useCommandContext("CommandEmpty");
    if (visibleCount > 0) return null;
    if (!search.trim()) return null;
    return (
        <div
            data-refineui="command-empty"
            role="presentation"
            className={clsx(commandStyles.empty, className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CommandGroup({ className, children, ...props }: CommandGroupProps) {
    const groupId = useId();
    const { registerGroup, groupHasVisibleItems } = useCommandContext("CommandGroup");

    useEffect(() => registerGroup(groupId), [registerGroup, groupId]);

    const visible = groupHasVisibleItems(groupId);
    const groupCtx = useMemo(() => ({ groupId }), [groupId]);

    return (
        <CommandGroupContext.Provider value={groupCtx}>
            <div
                data-refineui="command-group"
                role="group"
                hidden={!visible}
                className={clsx(commandStyles.group, className)}
                {...props}
            >
                {children}
            </div>
        </CommandGroupContext.Provider>
    );
}

export function CommandGroupHeading({ className, children, ...props }: CommandGroupHeadingProps) {
    useCommandContext("CommandGroupHeading");
    return (
        <div
            data-refineui="command-group-heading"
            className={clsx(commandStyles.groupHeading, className)}
            {...props}
        >
            {children}
        </div>
    );
}

function isCommandListContentNode(node: Element): boolean {
    const slot = node.getAttribute("data-refineui");
    if (slot === "command-separator" || slot === "command-empty") return false;
    if (node.hasAttribute("hidden")) return false;
    if (slot === "command-group" || slot === "command-item") return true;
    return false;
}

function hasVisibleCommandNeighbor(el: HTMLElement, direction: "previousElementSibling" | "nextElementSibling"): boolean {
    let node: Element | null = el[direction];
    while (node) {
        if (isCommandListContentNode(node)) return true;
        node = node[direction];
    }
    return false;
}

export function CommandSeparator({ className, ...props }: CommandSeparatorProps) {
    const { search, visibleCount } = useCommandContext("CommandSeparator");
    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(true);

    useIsomorphicLayoutEffect(() => {
        const el = ref.current;
        if (!el) {
            setShow(false);
            return;
        }
        const hasBefore = hasVisibleCommandNeighbor(el, "previousElementSibling");
        const hasAfter = hasVisibleCommandNeighbor(el, "nextElementSibling");
        setShow(hasBefore && hasAfter);
    }, [search, visibleCount]);

    return (
        <div
            ref={ref}
            data-refineui="command-separator"
            role="separator"
            aria-orientation="horizontal"
            hidden={!show}
            className={clsx(commandStyles.separatorWrap, className)}
            {...props}
        >
            <div className={commandStyles.separatorLine} />
        </div>
    );
}

export const CommandItem = forwardRef<HTMLButtonElement, CommandItemProps>(function CommandItem(
    {
        className,
        value,
        keywords,
        onSelect,
        forceMount = false,
        disabled = false,
        startIcon,
        endIcon,
        shortcut,
        children,
        onClick,
        onMouseMove,
        ...props
    },
    forwardedRef,
) {
    const {
        selectedValue,
        setSelectedValue,
        listId,
        registerItem,
        isItemVisible,
        selectById,
    } = useCommandContext("CommandItem");
    const group = useContext(CommandGroupContext);
    const itemId = useId();
    const nodeRef = useRef<HTMLButtonElement | null>(null);
    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;
    const keywordsKey = keywords?.join("\0") ?? "";

    const setRefs = useCallback(
        (node: HTMLButtonElement | null) => {
            nodeRef.current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
        },
        [forwardedRef],
    );

    useEffect(() => {
        const keywordList = keywordsKey ? keywordsKey.split("\0") : [];
        return registerItem({
            id: itemId,
            value,
            keywords: keywordList,
            disabled: !!disabled,
            forceMount,
            groupId: group?.groupId ?? null,
            nodeRef,
            onSelect: (v) => onSelectRef.current?.(v),
        });
    }, [registerItem, itemId, value, keywordsKey, disabled, forceMount, group?.groupId]);

    const visible = isItemVisible(itemId);
    if (!visible) return null;

    const isSelected = selectedValue === value;
    const domId = `${listId}-item-${cssEscape(value)}`;

    return (
        <button
            ref={setRefs}
            id={domId}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={disabled}
            data-refineui="command-item"
            data-selected={isSelected || undefined}
            data-disabled={disabled || undefined}
            className={clsx(
                commandStyles.itemBase,
                disabled ? commandStyles.itemDisabled : commandStyles.itemEnabled,
                isSelected && !disabled && commandStyles.itemSelected,
                className,
            )}
            onMouseMove={(event) => {
                onMouseMove?.(event);
                if (!disabled && selectedValue !== value) setSelectedValue(value);
            }}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented || disabled) return;
                selectById(itemId);
            }}
            {...props}
        >
            {startIcon ? (
                <span
                    className={commandStyles.iconWrap}
                    style={{
                        width: iconSizes.small,
                        minWidth: iconSizes.small,
                        height: iconSizes.small,
                    }}
                >
                    {startIcon}
                </span>
            ) : null}
            {children}
            {shortcut ? (
                typeof shortcut === "string" || typeof shortcut === "number" ? (
                    <CommandShortcut>{shortcut}</CommandShortcut>
                ) : (
                    shortcut
                )
            ) : null}
            {endIcon ? (
                <span
                    className={commandStyles.iconWrap}
                    style={{
                        width: iconSizes.small,
                        minWidth: iconSizes.small,
                        height: iconSizes.small,
                    }}
                >
                    {endIcon}
                </span>
            ) : null}
        </button>
    );
});

export function CommandShortcut({ className, children, ...props }: CommandShortcutProps) {
    return (
        <span data-refineui="command-shortcut" className={clsx(commandStyles.shortcut, className)} {...props}>
            {children}
        </span>
    );
}

/** Safe-ish id fragment for aria-activedescendant (values may contain spaces). */
function cssEscape(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}
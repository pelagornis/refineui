import { clsx } from "clsx";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useId,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type MutableRefObject,
    type PointerEvent,
} from "react";
import { WebIcon } from "../../WebIcon";
import type { FormControlSize } from "../../formControlSizes";
import { useOptionalFieldSize } from "../Field/context";
import {
    searchFieldClearIconSize,
    searchFieldFilledSizeClass,
    searchFieldLeadingIconSize,
    searchFieldStyles,
    searchFieldTypoClass,
} from "./style";
import type {
    SearchFieldClearProps,
    SearchFieldIconProps,
    SearchFieldInputProps,
    SearchFieldProps,
} from "./types";

type SearchFieldContextValue = {
    value: string;
    setValue: (next: string) => void;
    clear: () => void;
    disabled: boolean;
    size: FormControlSize;
    inputId: string;
    inputLabel: string | undefined;
    inputRef: MutableRefObject<HTMLInputElement | null>;
};

const SearchFieldContext = createContext<SearchFieldContextValue | null>(null);

function useSearchFieldContext(component: string): SearchFieldContextValue {
    const ctx = useContext(SearchFieldContext);
    if (!ctx) {
        throw new Error(`${component} must be used within SearchField.`);
    }
    return ctx;
}

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

export function SearchField({
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    appearance = "filled",
    size: sizeProp,
    className,
    children,
    id,
    onPointerDown,
    "aria-label": ariaLabel = "Search",
    ...props
}: SearchFieldProps) {
    const fieldSize = useOptionalFieldSize();
    const size = sizeProp ?? fieldSize ?? "md";
    const [query, setQuery] = useControllableString(value, defaultValue, onValueChange);
    const inputRef = useRef<HTMLInputElement>(null);
    const reactId = useId();
    const inputId = id ?? `refineui-search-field-${reactId}`;

    const clear = useCallback(() => {
        setQuery("");
        inputRef.current?.focus();
    }, [setQuery]);

    const ctx = useMemo<SearchFieldContextValue>(
        () => ({
            value: query,
            setValue: setQuery,
            clear,
            disabled,
            size,
            inputId,
            inputLabel: ariaLabel,
            inputRef,
        }),
        [ariaLabel, clear, disabled, size, inputId, query, setQuery],
    );

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || disabled) return;
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.closest("input, button")) return;
        event.preventDefault();
        inputRef.current?.focus();
    };

    return (
        <SearchFieldContext.Provider value={ctx}>
            <div
                data-refineui="search-field"
                data-appearance={appearance}
                data-size={size}
                data-disabled={disabled || undefined}
                className={clsx(
                    searchFieldStyles.root,
                    searchFieldTypoClass[size],
                    appearance === "plain"
                        ? searchFieldStyles.rootPlain
                        : [searchFieldStyles.rootFilled, searchFieldFilledSizeClass[size]],
                    disabled &&
                        (appearance === "plain"
                            ? searchFieldStyles.rootPlainDisabled
                            : searchFieldStyles.rootDisabled),
                    className,
                )}
                {...props}
                onPointerDown={handlePointerDown}
            >
                {children}
            </div>
        </SearchFieldContext.Provider>
    );
}

export function SearchFieldIcon({ children, className, ...props }: SearchFieldIconProps) {
    const { disabled, size } = useSearchFieldContext("SearchFieldIcon");

    return (
        <span
            data-refineui="search-field-icon"
            aria-hidden
            className={clsx(
                searchFieldStyles.icon,
                disabled && searchFieldStyles.iconDisabled,
                className,
            )}
            {...props}
        >
            {children ?? (
                <WebIcon
                    name="search"
                    size={searchFieldLeadingIconSize[size]}
                    color="currentColor"
                    aria-hidden
                />
            )}
        </span>
    );
}

export const SearchFieldInput = forwardRef<HTMLInputElement, SearchFieldInputProps>(
    function SearchFieldInput(
        {
            className,
            id,
            onChange,
            onKeyDown,
            autoComplete = "off",
            enterKeyHint = "search",
            "aria-label": ariaLabel,
            ...props
        },
        ref,
    ) {
        const { value, setValue, disabled, inputId, inputLabel, inputRef } =
            useSearchFieldContext("SearchFieldInput");

        const setRefs = (node: HTMLInputElement | null) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Escape" && value.length > 0) {
                event.preventDefault();
                setValue("");
            }
            onKeyDown?.(event);
        };

        return (
            <input
                {...props}
                ref={setRefs}
                id={id ?? inputId}
                type="search"
                value={value}
                disabled={disabled}
                autoComplete={autoComplete}
                enterKeyHint={enterKeyHint}
                aria-label={ariaLabel ?? inputLabel}
                data-refineui="search-field-input"
                className={clsx(searchFieldStyles.input, className)}
                onChange={(event) => {
                    setValue(event.target.value);
                    onChange?.(event);
                }}
                onKeyDown={handleKeyDown}
            />
        );
    },
);

export function SearchFieldClear({
    className,
    children,
    disabled: disabledProp,
    onClick,
    "aria-label": ariaLabel = "Clear search",
    ...props
}: SearchFieldClearProps) {
    const { value, clear, disabled, size } = useSearchFieldContext("SearchFieldClear");
    const isDisabled = disabledProp ?? disabled;

    if (value.length === 0) return null;

    return (
        <button
            {...props}
            type="button"
            data-refineui="search-field-clear"
            aria-label={ariaLabel}
            disabled={isDisabled}
            className={clsx(
                searchFieldStyles.clear,
                isDisabled && searchFieldStyles.clearDisabled,
                className,
            )}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                clear();
            }}
        >
            {children ?? (
                <WebIcon
                    name="dismiss"
                    size={searchFieldClearIconSize[size]}
                    color="currentColor"
                    iconStyle="filled"
                    aria-hidden
                />
            )}
        </button>
    );
}

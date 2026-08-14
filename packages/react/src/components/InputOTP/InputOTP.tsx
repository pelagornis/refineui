import { clsx } from "clsx";
import type {
    ChangeEvent,
    ClipboardEvent,
    FocusEvent,
    InputHTMLAttributes,
    KeyboardEvent,
} from "react";
import {
    createContext,
    useCallback,
    useContext,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { useOptionalFieldSize } from "../Field/context";
import { inputOtpSlotSizeClass, inputOtpStyles } from "./style";
import type { InputOTPProps, InputOTPSize, InputOTPSlotProps } from "./types";

const DEFAULT_PATTERN = /\d/;

type InputOTPContextValue = {
    value: string;
    maxLength: number;
    size: InputOTPSize;
    disabled: boolean;
    inputMode: InputHTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
    name?: string;
    inputId: string;
    autoFocus: boolean;
    register: (index: number, el: HTMLInputElement | null) => void;
    focusAt: (index: number) => void;
    setCharAt: (index: number, char: string) => void;
    clearAt: (index: number) => void;
    pasteAt: (index: number, text: string) => void;
};

const InputOTPContext = createContext<InputOTPContextValue | null>(null);

function useInputOTPContext(component: string): InputOTPContextValue {
    const v = useContext(InputOTPContext);
    if (!v) throw new Error(`${component} must be used within InputOTP.`);
    return v;
}

function filterChars(raw: string, pattern: RegExp): string {
    let out = "";
    for (const char of raw) {
        pattern.lastIndex = 0;
        if (!pattern.test(char)) continue;
        out += char;
    }
    return out;
}

function filterValue(raw: string, maxLength: number, pattern: RegExp): string {
    return filterChars(raw, pattern).slice(0, maxLength);
}

export function InputOTP({
    value: valueProp,
    defaultValue = "",
    onValueChange,
    maxLength,
    size: sizeProp,
    disabled = false,
    pattern = DEFAULT_PATTERN,
    autoFocus = false,
    name,
    id,
    inputMode = "numeric",
    autoComplete = "one-time-code",
    className,
    children,
    "aria-label": ariaLabel = "One-time password",
    ...props
}: InputOTPProps) {
    const fieldSize = useOptionalFieldSize();
    const size = sizeProp ?? fieldSize ?? "lg";
    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = useState(() =>
        filterValue(defaultValue, maxLength, pattern),
    );
    const value = filterValue(isControlled ? valueProp! : uncontrolled, maxLength, pattern);
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const reactId = useId();
    const inputId = id ?? `refineui-input-otp-${reactId}`;

    const commit = useCallback(
        (next: string) => {
            const filtered = filterValue(next, maxLength, pattern);
            if (!isControlled) setUncontrolled(filtered);
            onValueChange?.(filtered);
            return filtered;
        },
        [isControlled, maxLength, onValueChange, pattern],
    );

    const focusAt = useCallback(
        (index: number) => {
            const i = Math.min(Math.max(index, 0), Math.max(maxLength - 1, 0));
            const el = refs.current[i];
            el?.focus();
            el?.select();
        },
        [maxLength],
    );

    const register = useCallback((index: number, el: HTMLInputElement | null) => {
        refs.current[index] = el;
    }, []);

    const setCharAt = useCallback(
        (index: number, char: string) => {
            const digit = filterChars(char, pattern).slice(-1);
            if (!digit) return;
            const at = Math.min(Math.max(index, 0), maxLength - 1);
            commit(value.slice(0, at) + digit);
            if (at < maxLength - 1) focusAt(at + 1);
            else focusAt(at);
        },
        [commit, focusAt, maxLength, pattern, value],
    );

    const clearAt = useCallback(
        (index: number) => {
            const at = Math.min(Math.max(index, 0), maxLength - 1);
            if (value[at]) {
                commit(value.slice(0, at) + value.slice(at + 1));
                focusAt(at);
                return;
            }
            if (at > 0) {
                commit(value.slice(0, at - 1) + value.slice(at));
                focusAt(at - 1);
            }
        },
        [commit, focusAt, maxLength, value],
    );

    const pasteAt = useCallback(
        (index: number, text: string) => {
            const chunk = filterChars(text, pattern);
            if (!chunk) return;
            const at = Math.min(Math.max(index, 0), maxLength - 1);
            const next = commit(value.slice(0, at) + chunk);
            focusAt(Math.min(Math.max(next.length, 0), maxLength - 1));
        },
        [commit, focusAt, maxLength, pattern, value],
    );

    const ctx = useMemo<InputOTPContextValue>(
        () => ({
            value,
            maxLength,
            size,
            disabled,
            inputMode,
            autoComplete,
            name,
            inputId,
            autoFocus,
            register,
            focusAt,
            setCharAt,
            clearAt,
            pasteAt,
        }),
        [
            value,
            maxLength,
            size,
            disabled,
            inputMode,
            autoComplete,
            name,
            inputId,
            autoFocus,
            register,
            focusAt,
            setCharAt,
            clearAt,
            pasteAt,
        ],
    );

    return (
        <InputOTPContext.Provider value={ctx}>
            <div
                data-refineui="input-otp"
                data-size={size}
                data-disabled={disabled || undefined}
                role="group"
                aria-label={ariaLabel}
                className={clsx(inputOtpStyles.root, className)}
                {...props}
            >
                {children}
            </div>
        </InputOTPContext.Provider>
    );
}

export function InputOTPSlot({
    index,
    className,
    onChange,
    onKeyDown,
    onPaste,
    onFocus,
    ...props
}: InputOTPSlotProps) {
    const {
        value,
        size,
        disabled,
        inputMode,
        autoComplete,
        name,
        inputId,
        autoFocus,
        register,
        focusAt,
        setCharAt,
        clearAt,
        pasteAt,
        maxLength,
    } = useInputOTPContext("InputOTPSlot");

    const char = value[index] ?? "";

    const onSlotChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        if (e.defaultPrevented) return;
        const raw = e.target.value;
        if (!raw) {
            clearAt(index);
            return;
        }
        if (raw.length > 1) {
            pasteAt(index, raw);
            return;
        }
        setCharAt(index, raw);
    };

    const onSlotKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;

        if (e.key === "Backspace") {
            e.preventDefault();
            clearAt(index);
            return;
        }
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            focusAt(index - 1);
            return;
        }
        if (e.key === "ArrowRight") {
            e.preventDefault();
            focusAt(index + 1);
        }
    };

    const onSlotPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        onPaste?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        pasteAt(index, e.clipboardData.getData("text"));
    };

    const onSlotFocus = (e: FocusEvent<HTMLInputElement>) => {
        onFocus?.(e);
        e.target.select();
    };

    return (
        <input
            ref={(el) => register(index, el)}
            data-refineui="input-otp-slot"
            data-index={index}
            data-filled={char ? true : undefined}
            id={index === 0 ? inputId : `${inputId}-${index}`}
            name={name ? `${name}-${index}` : undefined}
            type="text"
            inputMode={inputMode}
            autoComplete={index === 0 ? autoComplete : "off"}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus={autoFocus && index === 0}
            disabled={disabled}
            maxLength={index === 0 ? maxLength : 1}
            value={char}
            aria-label={`Digit ${index + 1} of ${maxLength}`}
            className={clsx(inputOtpStyles.slot, inputOtpSlotSizeClass[size], className)}
            onChange={onSlotChange}
            onKeyDown={onSlotKeyDown}
            onPaste={onSlotPaste}
            onFocus={onSlotFocus}
            {...props}
        />
    );
}

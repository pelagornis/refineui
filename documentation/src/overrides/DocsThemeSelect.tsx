import { useEffect, useState } from "react";
import { iconSizes } from "@refineui/tokens";
import { Button } from "@refineui/react";

type DocsTheme = "auto" | "light" | "dark";

const STORAGE_KEY = "starlight-theme";
const THEME_ORDER: DocsTheme[] = ["light", "dark", "auto"];

function parseTheme(value: string | null): DocsTheme {
    return value === "light" || value === "dark" ? value : "auto";
}

function preferredScheme(): "light" | "dark" {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: DocsTheme) {
    const resolved = theme === "auto" ? preferredScheme() : theme;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    localStorage.setItem(STORAGE_KEY, theme === "auto" ? "" : theme);
}

function ThemeGlyph({ theme }: { theme: DocsTheme }) {
    const size = iconSizes.xsmall;
    if (theme === "dark") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={size} height={size} aria-hidden>
                <path
                    fill="currentColor"
                    d="M6.2 1.4a.75.75 0 0 1 .22 1.04 5.25 5.25 0 1 0 7.14 7.14.75.75 0 0 1 1.26.81A6.75 6.75 0 1 1 5.16 1.18a.75.75 0 0 1 1.04.22"
                />
            </svg>
        );
    }
    if (theme === "auto") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={size} height={size} aria-hidden>
                <path
                    fill="currentColor"
                    d="M3.5 2.75A1.75 1.75 0 0 1 5.25 1h5.5A1.75 1.75 0 0 1 12.5 2.75v8.5A1.75 1.75 0 0 1 10.75 13h-5.5A1.75 1.75 0 0 1 3.5 11.25zm1.5 0v8.5c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-5.5a.25.25 0 0 0-.25.25M5 14.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75"
                />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={size} height={size} aria-hidden>
            <path
                fill="currentColor"
                d="M8 1.25a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V2A.75.75 0 0 1 8 1.25M3.22 3.22a.75.75 0 0 1 1.06 0l.884.884a.75.75 0 1 1-1.06 1.06L3.22 4.28a.75.75 0 0 1 0-1.06M12.78 3.22a.75.75 0 0 1 0 1.06l-.884.884a.75.75 0 0 1-1.06-1.06l.884-.884a.75.75 0 0 1 1.06 0M8 5.5A2.5 2.5 0 1 1 8 10.5 2.5 2.5 0 0 1 8 5.5M1.25 8a.75.75 0 0 1 .75-.75h1.25a.75.75 0 0 1 0 1.5H2A.75.75 0 0 1 1.25 8m11.5 0a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75M4.104 10.836a.75.75 0 0 1 1.06 0l.884.884a.75.75 0 1 1-1.06 1.06l-.884-.884a.75.75 0 0 1 0-1.06m7.792 0a.75.75 0 0 1 0 1.06l-.884.884a.75.75 0 0 1-1.06-1.06l.884-.884a.75.75 0 0 1 1.06 0M8 12.75a.75.75 0 0 1 .75.75V14.75a.75.75 0 0 1-1.5 0V13.5a.75.75 0 0 1 .75-.75"
            />
        </svg>
    );
}

export function DocsThemeSelect() {
    const [theme, setTheme] = useState<DocsTheme>("auto");

    useEffect(() => {
        const next = parseTheme(localStorage.getItem(STORAGE_KEY));
        setTheme(next);
        applyTheme(next);

        const media = window.matchMedia("(prefers-color-scheme: light)");
        const onScheme = () => {
            if (parseTheme(localStorage.getItem(STORAGE_KEY)) === "auto") applyTheme("auto");
        };
        media.addEventListener("change", onScheme);
        return () => media.removeEventListener("change", onScheme);
    }, []);

    const label = theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System";

    return (
        <Button
            layout="icon"
            variant="ghost"
            size="sm"
            aria-label={`Theme: ${label}`}
            onClick={() => {
                const ix = THEME_ORDER.indexOf(theme);
                const parsed = THEME_ORDER[(ix + 1) % THEME_ORDER.length] ?? "auto";
                setTheme(parsed);
                applyTheme(parsed);
            }}
        >
            <ThemeGlyph theme={theme} />
        </Button>
    );
}

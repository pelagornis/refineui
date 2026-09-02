/** Token-driven animated gradient mesh inside the hero banner. */
export function HeroBackdrop() {
    return (
        <div data-refineui-home-backdrop aria-hidden>
            <div data-refineui-home-gradient="flow" />
            <div data-refineui-home-gradient="mesh" />
            <div data-refineui-home-glow-wrap="primary">
                <span data-refineui-home-glow="primary" />
            </div>
            <div data-refineui-home-glow-wrap="secondary">
                <span data-refineui-home-glow="secondary" />
            </div>
            <div data-refineui-home-glow-wrap="tertiary">
                <span data-refineui-home-glow="tertiary" />
            </div>
        </div>
    );
}

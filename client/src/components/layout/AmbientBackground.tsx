/**
 * Purely decorative — a handful of very low-opacity, blurred diagonal
 * gradient streaks. Meant to be dropped inside a `relative overflow-hidden`
 * section (behind its content, e.g. via DOM order + `relative z-10` on the
 * content) rather than mounted globally — most pages' backgrounds are
 * opaque (cards, `bg-zinc-50` canvas) and would just hide it. `absolute
 * inset-0` fills whatever positioned ancestor it's placed in.
 * `pointer-events-none` and `aria-hidden` so it never interferes with
 * layout, interaction, or screen readers; opacity is kept low enough that
 * text contrast on top is unaffected.
 */
export function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[-10%] top-[-5%] h-2 w-[140%] -rotate-6 bg-gradient-to-r from-transparent via-accent/25 to-transparent blur-3xl" />
      <div className="absolute left-[-10%] top-[35%] h-2 w-[140%] rotate-3 bg-gradient-to-r from-transparent via-zinc-400/20 to-transparent blur-3xl" />
      <div className="absolute left-[-10%] top-[70%] h-2 w-[140%] -rotate-3 bg-gradient-to-r from-transparent via-accent/20 to-transparent blur-3xl" />
    </div>
  );
}

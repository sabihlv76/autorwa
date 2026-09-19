// Purely decorative "speed lines" motif — on-theme for a car marketplace.
// Mounted locally by a single section's own `relative` container (same
// "don't make it a sitewide fixture" rule as AmbientBackground), not
// reused elsewhere, so this stays a subtle accent rather than a running
// pattern across the page.
export function SpeedLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="animate-speed-line absolute left-0 top-1/4 h-px w-1/3 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <span
        className="animate-speed-line absolute left-0 top-1/2 h-px w-1/4 bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        style={{ animationDelay: "1.2s" }}
      />
      <span
        className="animate-speed-line absolute left-0 top-3/4 h-px w-1/3 bg-gradient-to-r from-transparent via-accent/25 to-transparent"
        style={{ animationDelay: "2.4s" }}
      />
    </div>
  );
}

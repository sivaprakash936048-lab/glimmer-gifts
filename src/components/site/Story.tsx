export const Story = () => {
  return (
    <section id="story" className="relative py-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Our craft</span>
        <h2 className="mt-3 font-serif text-5xl md:text-7xl text-foreground text-balance leading-[1]">
          Each piece is small enough <em className="text-primary">to slip into a card</em> — and meant enough to keep.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground leading-relaxed">
          We work with eight independent makers across three continents, choosing pieces that feel quiet, considered and quietly joyful. Every gift is wrapped by hand in our Brooklyn studio.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
          {[
            { t: "Considered", d: "Small drops, hand-selected — never warehoused, never mass-made." },
            { t: "Tactile", d: "Materials chosen for how they feel in the hand, not just how they photograph." },
            { t: "Wrapped", d: "Every order arrives in a recycled-petal envelope, ready to gift." },
          ].map((b) => (
            <div key={b.t} className="glass rounded-3xl p-7 shadow-soft">
              <div className="font-serif text-3xl text-foreground">{b.t}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

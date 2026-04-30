import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Swapn's Gift World" className="h-12 w-12 object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl text-foreground">Swapn's <span className="text-primary">Gift</span></span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">world</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              A 3D-first gift boutique. Curated bracelets, pens and keychains — wrapped with care.
            </p>
            <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email for soft launches"
                className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background hover:opacity-90">Join</button>
            </form>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              <li><a href="#bracelets" className="story-link">Bracelets</a></li>
              <li><a href="#pens" className="story-link">Pens</a></li>
              <li><a href="#keychains" className="story-link">Keychains</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio</h4>
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              <li><a href="#story" className="story-link">Our craft</a></li>
              <li><a href="/track" className="story-link">Track an order</a></li>
              <li><a href="/admin" className="story-link">Admin dashboard</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Swapn's Gift World · Wrapped with love</span>
          <span className="italic">Wrapped with care.</span>
        </div>
      </div>
    </footer>
  );
};

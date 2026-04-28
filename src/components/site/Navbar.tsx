import { ShoppingBag, Search, User } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { count, setOpen } = useCart();
  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="glass shadow-soft rounded-full px-5 py-3 flex items-center justify-between">
          <a href="#top" className="font-serif text-2xl tracking-tight text-foreground">
            petal<span className="text-primary">.</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#shop" className="story-link text-muted-foreground hover:text-foreground transition-colors">Shop</a>
            <a href="#bracelets" className="story-link text-muted-foreground hover:text-foreground transition-colors">Bracelets</a>
            <a href="#pens" className="story-link text-muted-foreground hover:text-foreground transition-colors">Pens</a>
            <a href="#keychains" className="story-link text-muted-foreground hover:text-foreground transition-colors">Keychains</a>
            <a href="#story" className="story-link text-muted-foreground hover:text-foreground transition-colors">Our story</a>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
              <User className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setOpen(true)}
              className="relative ml-1 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{count}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

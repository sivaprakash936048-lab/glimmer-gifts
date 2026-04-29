import { useEffect, useMemo, useRef, useState } from "react";
import { Category, Product, categoryLabel, products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import { useCart } from "@/store/cart";
import { Search } from "lucide-react";

const filters: ("all" | Category)[] = ["all", "bracelets", "pens", "keychains"];
const categorySet = new Set<Category>(["bracelets", "pens", "keychains"]);

export const Shop = () => {
  const [active, setActive] = useState<"all" | Category>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Product | null>(null);
  const { add } = useCart();
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Sync category from URL hash (navbar links: #bracelets, #pens, #keychains)
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.replace("#", "");
      if (categorySet.has(h as Category)) setActive(h as Category);
      else if (h === "shop") setActive("all");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Smooth-scroll to grid when filter changes
  useEffect(() => {
    if (active !== "all") {
      gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [active]);

  const handleFilter = (f: "all" | Category) => {
    setActive(f);
    window.history.replaceState(null, "", f === "all" ? "#shop" : `#${f}`);
  };

  const list = useMemo(() => {
    return products.filter(p => {
      const matchCat = active === "all" || p.category === active;
      const q = query.trim().toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.material.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [active, query]);

  return (
    <section id="shop" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">The collection</span>
            <h2 className="mt-2 font-serif text-5xl md:text-6xl text-foreground text-balance">
              Small wonders, <em className="text-primary">spun in 3D</em>
            </h2>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shop…"
              className="w-full rounded-full border border-border bg-card pl-11 pr-5 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`rounded-full px-5 py-2 text-sm transition-all ${
                active === f
                  ? "bg-foreground text-background shadow-soft"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {f === "all" ? "All gifts" : categoryLabel[f]}
            </button>
          ))}
        </div>

        {/* Anchor target so navbar links scroll to the product grid */}
        <div ref={gridTopRef} id="bracelets" />
        <div id="pens" />
        <div id="keychains" />

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 70}ms` }} className="animate-fade-up">
              <ProductCard product={p} onOpen={setOpen} onAdd={add} />
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">No gifts match that — try another word.</p>
        )}
      </div>

      <ProductDialog product={open} onClose={() => setOpen(null)} />
    </section>
  );
};

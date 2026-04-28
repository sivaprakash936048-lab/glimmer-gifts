import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/store/cart";
import { ProductCanvas } from "@/components/three/ProductCanvas";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

export const CartDrawer = () => {
  const { items, open, setOpen, setQty, remove, total, clear, count } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-background">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="font-serif text-3xl text-foreground flex items-center gap-3">
            Your bag
            <span className="text-sm text-muted-foreground font-sans">{count} {count === 1 ? "gift" : "gifts"}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground py-20">
              <ShoppingBag className="h-10 w-10 mb-4 opacity-50" />
              <p className="font-serif text-2xl text-foreground">Nothing wrapped yet.</p>
              <p className="mt-1 text-sm">Add a little wonder from the shop.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 rounded-2xl glass p-3 shadow-soft">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-secondary/40 to-accent/30">
                    <ProductCanvas category={product.category} colors={product.colors} image={product.image} className="absolute inset-0" scale={0.85} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-serif text-lg text-foreground truncate">{product.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{product.tagline}</p>
                      </div>
                      <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-foreground" aria-label="Remove">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border bg-card">
                        <button onClick={() => setQty(product.id, qty - 1)} className="p-1.5" aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="p-1.5" aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-serif text-base text-foreground">₹{(product.price * qty).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-serif text-2xl text-foreground">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs text-muted-foreground">Free gift wrap & shipping over ₹2,000.</p>
            <button className="w-full rounded-full bg-foreground py-3.5 text-sm text-background shadow-float transition-transform hover:-translate-y-0.5">
              Checkout
            </button>
            <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-foreground">
              Clear bag
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

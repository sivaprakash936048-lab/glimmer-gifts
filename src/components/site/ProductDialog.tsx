import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Product } from "@/data/products";
import { ProductCanvas } from "@/components/three/ProductCanvas";
import { Plus, Minus, ShoppingBag, RotateCw } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export const ProductDialog = ({ product, onClose }: Props) => {
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && (onClose(), setQty(1))}>
      <DialogContent className="max-w-5xl p-0 border-0 bg-background/95 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-float">
        {product && (
          <div className="grid md:grid-cols-2 max-h-[88vh]">
            <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-secondary/40 to-accent/30">
              <ProductCanvas
                category={product.category}
                colors={product.colors}
                image={product.image}
                interactive
                className="absolute inset-0"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-4 py-2 text-xs text-muted-foreground shadow-soft">
                <RotateCw className="h-3.5 w-3.5" />
                Drag to rotate · Scroll to zoom
              </div>
            </div>

            <div className="flex flex-col p-8 md:p-10 overflow-y-auto">
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{product.category}</span>
              <h2 className="mt-2 font-serif text-4xl text-foreground">{product.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground italic">{product.tagline}</p>

              <div className="mt-6 font-serif text-3xl text-foreground">${product.price}</div>
              <p className="mt-5 text-sm leading-relaxed text-foreground/80">{product.description}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="uppercase tracking-[0.18em] text-muted-foreground">Material</dt>
                  <dd className="mt-1 text-foreground">{product.material}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-[0.18em] text-muted-foreground">Palette</dt>
                  <dd className="mt-2 flex gap-2">
                    {product.colors.map((c, i) => (
                      <span key={i} className="h-5 w-5 rounded-full ring-1 ring-border" style={{ background: c }} />
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto pt-8 flex items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-border bg-card">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3" aria-label="Decrease">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="p-3" aria-label="Increase">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => { for (let i = 0; i < qty; i++) add(product); onClose(); setQty(1); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm text-background shadow-float transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to bag · ${product.price * qty}
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

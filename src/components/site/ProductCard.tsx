import { Product } from "@/data/products";
import { ProductCanvas } from "@/components/three/ProductCanvas";
import { Plus } from "lucide-react";

interface Props {
  product: Product;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
}

export const ProductCard = ({ product, onOpen, onAdd }: Props) => {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[2rem] glass shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-float"
    >
      <button
        onClick={() => onOpen(product)}
        className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-secondary/40 to-accent/30"
        aria-label={`View ${product.name} in 3D`}
      >
        <ProductCanvas
          category={product.category}
          colors={product.colors}
          image={product.image}
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-background/70 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          3D
        </span>
      </button>
      <div className="flex items-end justify-between gap-4 p-5">
        <div className="min-w-0">
          <h3 className="font-serif text-2xl leading-tight text-foreground truncate">{product.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{product.tagline}</p>
          <div className="mt-3 flex items-center gap-2">
            {product.colors.slice(0, 3).map((c, i) => (
              <span key={i} className="h-3 w-3 rounded-full ring-1 ring-border" style={{ background: c }} />
            ))}
            <span className="ml-2 font-serif text-lg text-foreground">${product.price}</span>
          </div>
        </div>
        <button
          onClick={() => onAdd(product)}
          className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-soft transition-transform hover:scale-105"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

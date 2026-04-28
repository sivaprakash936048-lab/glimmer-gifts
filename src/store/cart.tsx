import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product } from "@/data/products";

interface CartItem { product: Product; qty: number; }
interface CartCtx {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  count: number;
  total: number;
}

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("petal-cart") || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("petal-cart", JSON.stringify(items));
  }, [items]);

  const add = (p: Product) => {
    setItems(prev => {
      const found = prev.find(i => i.product.id === p.id);
      if (found) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product: p, qty: 1 }];
    });
    setOpen(true);
  };
  const remove = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clear = () => setItems([]);

  const value = useMemo(() => ({
    items, add, remove, setQty, clear, open, setOpen,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.product.price, 0),
  }), [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

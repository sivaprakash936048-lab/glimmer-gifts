import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Order, STATUS_FLOW, findOrder } from "@/store/orders";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Check, Clock, Package, Truck, Gift, MapPin } from "lucide-react";
import { format } from "date-fns";

const STATUS_META: Record<string, { label: string; icon: React.ReactNode }> = {
  pending: { label: "Order received", icon: <Clock className="h-4 w-4" /> },
  confirmed: { label: "Confirmed", icon: <Check className="h-4 w-4" /> },
  packed: { label: "Wrapped & packed", icon: <Gift className="h-4 w-4" /> },
  shipped: { label: "Out for delivery", icon: <Truck className="h-4 w-4" /> },
  delivered: { label: "Delivered", icon: <Package className="h-4 w-4" /> },
};

const Track = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get("id") || "";
  const [query, setQuery] = useState(initial);
  const [order, setOrder] = useState<Order | undefined>(initial ? findOrder(initial) : undefined);
  const [searched, setSearched] = useState(!!initial);

  useEffect(() => { document.title = "Track your order · Swapn's Gift World"; }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const o = findOrder(query.trim());
    setOrder(o);
    setSearched(true);
    setParams(query.trim() ? { id: query.trim() } : {});
  };

  const currentIdx = useMemo(() => order ? STATUS_FLOW.indexOf(order.status as any) : -1, [order]);

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm">
            <ArrowLeft className="h-4 w-4" /> Storefront
          </Link>
          <h1 className="font-serif text-xl">Track your gift</h1>
          <span className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        <form onSubmit={handleSearch} className="rounded-2xl border border-border bg-background p-5">
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order ID</label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="SGW-XXXXXX"
                className="pl-9 font-mono"
              />
            </div>
            <button type="submit" className="rounded-md bg-foreground text-background px-5 text-sm">Track</button>
          </div>
        </form>

        {searched && !order && (
          <div className="rounded-2xl border border-border bg-background p-10 text-center text-muted-foreground">
            <p className="font-serif text-xl text-foreground mb-1">Order not found</p>
            <p className="text-sm">Double-check the ID — they look like <span className="font-mono">SGW-AB12CD</span>.</p>
          </div>
        )}

        {order && (
          <>
            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Order</p>
                  <p className="font-serif text-2xl">{order.id}</p>
                  <p className="text-xs text-muted-foreground mt-1">Placed {format(new Date(order.createdAt), "PPp")}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Total · COD</p>
                  <p className="font-serif text-2xl">₹{order.total.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>

            {order.status === "cancelled" ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900 text-sm">
                This order was cancelled.
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-background p-6">
                <h3 className="font-serif text-lg mb-5">Delivery progress</h3>
                <ol className="relative">
                  {STATUS_FLOW.map((s, i) => {
                    const reached = i <= currentIdx;
                    const event = order.history.find(h => h.status === s);
                    return (
                      <li key={s} className="flex gap-4 pb-5 last:pb-0 relative">
                        {i < STATUS_FLOW.length - 1 && (
                          <span className={`absolute left-4 top-9 bottom-0 w-px ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
                        )}
                        <span className={`relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 ${reached ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"}`}>
                          {STATUS_META[s].icon}
                        </span>
                        <div className="flex-1">
                          <p className={reached ? "text-foreground" : "text-muted-foreground"}>{STATUS_META[s].label}</p>
                          {event && <p className="text-xs text-muted-foreground">{format(new Date(event.at), "PPp")}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-background p-5">
                <h4 className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Shipping to</h4>
                <p className="text-sm font-medium">{order.customer.name}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>
                    {order.customer.address1}{order.customer.address2 ? `, ${order.customer.address2}` : ""}<br />
                    {order.customer.city}, {order.customer.state} – {order.customer.pincode}
                  </span>
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-5">
                <h4 className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Gift</h4>
                {order.gift.recipientName && <p className="text-sm">For <strong>{order.gift.recipientName}</strong></p>}
                <p className="text-xs text-muted-foreground">Wrap: {order.gift.wrapStyle}</p>
                {order.gift.message && <p className="mt-2 text-xs italic rounded-lg bg-muted/60 p-2">"{order.gift.message}"</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5">
              <h4 className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">Items</h4>
              <ul className="space-y-2">
                {order.items.map(i => (
                  <li key={i.productId} className="flex items-center gap-3 text-sm">
                    <img src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{i.name}</div>
                      <div className="text-xs text-muted-foreground">₹{i.price.toLocaleString("en-IN")} × {i.qty}</div>
                    </div>
                    <div className="font-serif">₹{(i.price * i.qty).toLocaleString("en-IN")}</div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Track;

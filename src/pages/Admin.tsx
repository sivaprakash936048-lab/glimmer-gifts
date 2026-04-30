import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Order, OrderStatus, STATUS_FLOW, loadOrders, updateOrderStatus } from "@/store/orders";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import {
  ArrowLeft, ShoppingBag, IndianRupee, Package, TrendingUp, Search, Gift, MapPin, Phone, Mail, Calendar
} from "lucide-react";
import { format } from "date-fns";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  confirmed: "bg-sky-100 text-sky-900 border-sky-200",
  packed: "bg-violet-100 text-violet-900 border-violet-200",
  shipped: "bg-indigo-100 text-indigo-900 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-900 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 border-rose-200",
};

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent-foreground))", "hsl(var(--muted-foreground))"];

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    document.title = "Admin · Swapn's Gift World";
    const refresh = () => setOrders(loadOrders());
    refresh();
    window.addEventListener("orders:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("orders:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const stats = useMemo(() => {
    const active = orders.filter(o => o.status !== "cancelled");
    const revenue = active.reduce((s, o) => s + o.total, 0);
    const delivered = orders.filter(o => o.status === "delivered").length;
    const pending = orders.filter(o => ["pending", "confirmed", "packed", "shipped"].includes(o.status)).length;
    const aov = active.length ? Math.round(revenue / active.length) : 0;
    return { revenue, delivered, pending, aov, count: orders.length };
  }, [orders]);

  // Revenue per day (last 14 days)
  const revenueByDay = useMemo(() => {
    const days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
      const key = format(d, "MMM d");
      const dayOrders = orders.filter(o => {
        const od = new Date(o.createdAt); od.setHours(0,0,0,0);
        return od.getTime() === d.getTime() && o.status !== "cancelled";
      });
      days.push({
        date: key,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(i => {
      map[i.category] = (map[i.category] || 0) + i.price * i.qty;
    }));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach(o => o.items.forEach(i => {
      if (!map[i.productId]) map[i.productId] = { name: i.name, qty: 0, revenue: 0 };
      map[i.productId].qty += i.qty;
      map[i.productId].revenue += i.qty * i.price;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return o.id.toLowerCase().includes(q)
          || o.customer.name.toLowerCase().includes(q)
          || o.customer.email.toLowerCase().includes(q)
          || o.customer.phone.includes(q);
      }
      return true;
    });
  }, [orders, query, statusFilter]);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    if (selected?.id === id) {
      setSelected(loadOrders().find(o => o.id === id) || null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm">
              <ArrowLeft className="h-4 w-4" /> Storefront
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="font-serif text-2xl">Admin Dashboard</h1>
          </div>
          <Link to="/track" className="text-xs text-muted-foreground hover:text-foreground">Customer tracking →</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi icon={<IndianRupee className="h-4 w-4" />} label="Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} />
          <Kpi icon={<ShoppingBag className="h-4 w-4" />} label="Orders" value={stats.count} />
          <Kpi icon={<Package className="h-4 w-4" />} label="In progress" value={stats.pending} />
          <Kpi icon={<TrendingUp className="h-4 w-4" />} label="Avg order value" value={`₹${stats.aov.toLocaleString("en-IN")}`} />
        </section>

        {/* Charts */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-background p-5">
            <h3 className="font-serif text-lg mb-1">Revenue · last 14 days</h3>
            <p className="text-xs text-muted-foreground mb-4">Trend of confirmed order value per day.</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <h3 className="font-serif text-lg mb-1">By category</h3>
            <p className="text-xs text-muted-foreground mb-4">Revenue split.</p>
            <div className="h-64">
              {categoryBreakdown.length === 0 ? (
                <Empty label="No sales yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                      {categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* Top products */}
        <section className="rounded-2xl border border-border bg-background p-5">
          <h3 className="font-serif text-lg mb-4">Top products</h3>
          {topProducts.length === 0 ? <Empty label="No products sold yet" /> : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Orders table */}
        <section className="rounded-2xl border border-border bg-background p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-serif text-lg">Orders</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search ID, name, email…" className="pl-9 w-64" />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUS_FLOW.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  <SelectItem value="cancelled">cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No orders {orders.length === 0 ? "yet — place one from the storefront to see it here." : "match your filters."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(o => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{o.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{o.customer.city}, {o.customer.state}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(o.createdAt), "MMM d, p")}</TableCell>
                    <TableCell>{o.items.reduce((s, i) => s + i.qty, 0)}</TableCell>
                    <TableCell className="font-serif">₹{o.total.toLocaleString("en-IN")}</TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Select value={o.status} onValueChange={(v) => handleStatusChange(o.id, v as OrderStatus)}>
                        <SelectTrigger className={`w-36 h-8 text-xs border ${STATUS_COLORS[o.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_FLOW.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          <SelectItem value="cancelled">cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </main>

      {/* Order detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl flex items-center gap-3">
                  Order {selected.id}
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                </DialogTitle>
                <DialogDescription>
                  Placed {format(new Date(selected.createdAt), "PPpp")} · Cash on Delivery
                </DialogDescription>
              </DialogHeader>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Panel title="Customer">
                  <P icon={<MapPin className="h-3.5 w-3.5" />}>{selected.customer.name}</P>
                  <P icon={<Mail className="h-3.5 w-3.5" />}>{selected.customer.email}</P>
                  <P icon={<Phone className="h-3.5 w-3.5" />}>{selected.customer.phone}</P>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selected.customer.address1}{selected.customer.address2 ? `, ${selected.customer.address2}` : ""}<br />
                    {selected.customer.city}, {selected.customer.state} – {selected.customer.pincode}
                  </p>
                </Panel>
                <Panel title="Gift details">
                  <P icon={<Gift className="h-3.5 w-3.5" />}>For: <strong>{selected.gift.recipientName || "—"}</strong></P>
                  <P icon={<Package className="h-3.5 w-3.5" />}>Wrap: {selected.gift.wrapStyle}</P>
                  {selected.gift.deliveryDate && (
                    <P icon={<Calendar className="h-3.5 w-3.5" />}>Deliver by: {format(new Date(selected.gift.deliveryDate), "PPP")}</P>
                  )}
                  {selected.gift.message && (
                    <div className="mt-2 rounded-lg bg-muted/60 p-2.5 text-xs italic">"{selected.gift.message}"</div>
                  )}
                </Panel>
              </div>

              <Panel title="Items" className="mt-4">
                <ul className="space-y-2">
                  {selected.items.map(i => (
                    <li key={i.productId} className="flex items-center gap-3 text-sm">
                      <img src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{i.name}</div>
                        <div className="text-xs text-muted-foreground">{i.category} · ₹{i.price.toLocaleString("en-IN")} × {i.qty}</div>
                      </div>
                      <div className="font-serif">₹{(i.price * i.qty).toLocaleString("en-IN")}</div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border mt-3 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{selected.subtotal.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{selected.shipping === 0 ? "Free" : `₹${selected.shipping}`}</span></div>
                  <div className="flex justify-between font-serif text-base pt-1"><span>Total</span><span>₹{selected.total.toLocaleString("en-IN")}</span></div>
                </div>
              </Panel>

              <Panel title="Status timeline" className="mt-4">
                <ol className="space-y-2">
                  {selected.history.map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className={`mt-1 h-2 w-2 rounded-full ${i === selected.history.length - 1 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      <div>
                        <div className="capitalize">{h.status}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(h.at), "PPp")}{h.note ? ` · ${h.note}` : ""}</div>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 flex items-center gap-2">
                  <Select value={selected.status} onValueChange={(v) => handleStatusChange(selected.id, v as OrderStatus)}>
                    <SelectTrigger className="w-40 h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_FLOW.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      <SelectItem value="cancelled">cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">Update order status</span>
                </div>
              </Panel>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Kpi = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-background p-4">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {icon} {label}
    </div>
    <div className="font-serif text-2xl mt-2">{value}</div>
  </div>
);

const Panel = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-border bg-muted/20 p-4 ${className}`}>
    <h4 className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{title}</h4>
    {children}
  </div>
);

const P = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-sm text-foreground">
    <span className="text-muted-foreground">{icon}</span>{children}
  </div>
);

const Empty = ({ label }: { label: string }) => (
  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{label}</div>
);

export default Admin;

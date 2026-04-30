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
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import {
  ArrowLeft, ShoppingBag, IndianRupee, Package, TrendingUp, Search, Gift, MapPin, Phone, Mail,
  Calendar, LayoutDashboard, ListOrdered, BarChart3, Users, Sparkles, ArrowUpRight, ArrowDownRight,
  Download, Clock, Truck, CheckCircle2
} from "lucide-react";
import { format, subDays, startOfDay, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

type View = "overview" | "orders" | "analytics" | "customers";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  confirmed: "bg-sky-100 text-sky-900 border-sky-200",
  packed: "bg-violet-100 text-violet-900 border-violet-200",
  shipped: "bg-indigo-100 text-indigo-900 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-900 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 border-rose-200",
};

const STATUS_DOT: Record<OrderStatus, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-sky-500",
  packed: "bg-violet-500",
  shipped: "bg-indigo-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-rose-500",
};

const PIE_COLORS = ["hsl(40 55% 50%)", "hsl(285 55% 65%)", "hsl(220 55% 40%)", "hsl(340 60% 65%)"];

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<View>("overview");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState<7 | 14 | 30>(14);

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

  // ---------- Stats ----------
  const stats = useMemo(() => {
    const active = orders.filter(o => o.status !== "cancelled");
    const revenue = active.reduce((s, o) => s + o.total, 0);
    const delivered = orders.filter(o => o.status === "delivered").length;
    const pending = orders.filter(o => ["pending", "confirmed", "packed", "shipped"].includes(o.status)).length;
    const aov = active.length ? Math.round(revenue / active.length) : 0;

    const now = new Date();
    const weekAgo = subDays(now, 7);
    const prevWeek = subDays(now, 14);
    const thisWeek = active.filter(o => isAfter(new Date(o.createdAt), weekAgo));
    const lastWeek = active.filter(o => {
      const d = new Date(o.createdAt);
      return isAfter(d, prevWeek) && !isAfter(d, weekAgo);
    });
    const thisRev = thisWeek.reduce((s, o) => s + o.total, 0);
    const lastRev = lastWeek.reduce((s, o) => s + o.total, 0);
    const revChange = lastRev === 0 ? (thisRev > 0 ? 100 : 0) : Math.round(((thisRev - lastRev) / lastRev) * 100);
    const ordChange = lastWeek.length === 0 ? (thisWeek.length > 0 ? 100 : 0)
      : Math.round(((thisWeek.length - lastWeek.length) / lastWeek.length) * 100);

    return { revenue, delivered, pending, aov, count: orders.length, thisRev, revChange, ordChange, thisWeekCount: thisWeek.length };
  }, [orders]);

  // ---------- Charts data ----------
  const revenueByDay = useMemo(() => {
    const days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = dateRange - 1; i >= 0; i--) {
      const d = startOfDay(subDays(new Date(), i));
      const key = format(d, dateRange > 14 ? "MMM d" : "MMM d");
      const dayOrders = orders.filter(o => {
        const od = startOfDay(new Date(o.createdAt));
        return od.getTime() === d.getTime() && o.status !== "cancelled";
      });
      days.push({
        date: key,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      });
    }
    return days;
  }, [orders, dateRange]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    orders.filter(o => o.status !== "cancelled").forEach(o => o.items.forEach(i => {
      map[i.category] = (map[i.category] || 0) + i.price * i.qty;
    }));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return STATUS_FLOW.concat("cancelled" as OrderStatus).map(s => ({ status: s, count: map[s] || 0 }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number; image: string }> = {};
    orders.filter(o => o.status !== "cancelled").forEach(o => o.items.forEach(i => {
      if (!map[i.productId]) map[i.productId] = { name: i.name, qty: 0, revenue: 0, image: i.image };
      map[i.productId].qty += i.qty;
      map[i.productId].revenue += i.qty * i.price;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  const customers = useMemo(() => {
    const map: Record<string, { name: string; email: string; phone: string; city: string; orders: number; spent: number; last: string }> = {};
    orders.forEach(o => {
      const key = o.customer.email.toLowerCase();
      if (!map[key]) map[key] = {
        name: o.customer.name, email: o.customer.email, phone: o.customer.phone,
        city: `${o.customer.city}, ${o.customer.state}`, orders: 0, spent: 0, last: o.createdAt
      };
      map[key].orders += 1;
      if (o.status !== "cancelled") map[key].spent += o.total;
      if (new Date(o.createdAt) > new Date(map[key].last)) map[key].last = o.createdAt;
    });
    return Object.values(map).sort((a, b) => b.spent - a.spent);
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

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    if (selected?.id === id) {
      setSelected(loadOrders().find(o => o.id === id) || null);
    }
  };

  const exportCSV = () => {
    const rows = [
      ["Order ID", "Date", "Customer", "Email", "Phone", "City", "Items", "Total", "Status", "Gift Recipient", "Gift Message"],
      ...orders.map(o => [
        o.id, format(new Date(o.createdAt), "yyyy-MM-dd HH:mm"),
        o.customer.name, o.customer.email, o.customer.phone,
        `${o.customer.city}, ${o.customer.state}`,
        o.items.reduce((s, i) => s + i.qty, 0).toString(),
        o.total.toString(), o.status,
        o.gift.recipientName, (o.gift.message || "").replace(/\n/g, " "),
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navItems: { id: View; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "orders", label: "Orders", icon: <ListOrdered className="h-4 w-4" />, badge: stats.pending },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "customers", label: "Customers", icon: <Users className="h-4 w-4" />, badge: customers.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-secondary/20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 min-h-screen border-r border-border bg-background/60 backdrop-blur-xl sticky top-0">
          <div className="p-5 border-b border-border">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
              <ArrowLeft className="h-4 w-4" /> Storefront
            </Link>
            <div className="mt-4">
              <p className="font-serif text-2xl text-foreground">Atelier</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-1">Admin · Swapn's Gift</p>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(n => (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
                  view === n.id
                    ? "bg-foreground text-background shadow-soft"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2.5">{n.icon} {n.label}</span>
                {!!n.badge && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    view === n.id ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                  )}>{n.badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <button onClick={exportCSV} className="w-full flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-xs text-foreground hover:bg-muted/60">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <Link to="/track" className="block mt-2 text-center text-[11px] text-muted-foreground hover:text-foreground">Customer tracking →</Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Mobile top bar */}
          <header className="lg:hidden border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="px-4 py-3 flex items-center justify-between gap-2">
              <Link to="/" className="text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /></Link>
              <h1 className="font-serif text-lg">Admin</h1>
              <button onClick={exportCSV}><Download className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="flex border-t border-border overflow-x-auto">
              {navItems.map(n => (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  className={cn(
                    "flex-1 px-3 py-2 text-xs whitespace-nowrap border-b-2 transition",
                    view === n.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
                  )}
                >{n.label}</button>
              ))}
            </div>
          </header>

          <main className="p-5 lg:p-8 space-y-6 max-w-7xl">
            {/* Page header */}
            <div className="flex items-end justify-between flex-wrap gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {format(new Date(), "EEEE, MMMM d")}
                </p>
                <h2 className="font-serif text-4xl mt-1">
                  {view === "overview" && "Good day, Swapn ✨"}
                  {view === "orders" && "Orders"}
                  {view === "analytics" && "Analytics"}
                  {view === "customers" && "Customers"}
                </h2>
              </div>
              {view === "analytics" && (
                <div className="inline-flex rounded-full border border-border bg-background p-1 text-xs">
                  {[7, 14, 30].map(d => (
                    <button
                      key={d}
                      onClick={() => setDateRange(d as any)}
                      className={cn("px-3 py-1.5 rounded-full transition", dateRange === d ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
                    >{d}d</button>
                  ))}
                </div>
              )}
            </div>

            {/* OVERVIEW */}
            {view === "overview" && (
              <>
                {orders.length === 0 && <EmptyState />}

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <Kpi
                    icon={<IndianRupee className="h-4 w-4" />}
                    label="Revenue"
                    value={`₹${stats.revenue.toLocaleString("en-IN")}`}
                    delta={stats.revChange}
                    sub="vs last 7 days"
                    accent="from-amber-100 to-amber-50"
                  />
                  <Kpi
                    icon={<ShoppingBag className="h-4 w-4" />}
                    label="Total orders"
                    value={stats.count}
                    delta={stats.ordChange}
                    sub={`${stats.thisWeekCount} this week`}
                    accent="from-violet-100 to-violet-50"
                  />
                  <Kpi
                    icon={<Package className="h-4 w-4" />}
                    label="In progress"
                    value={stats.pending}
                    sub={`${stats.delivered} delivered`}
                    accent="from-sky-100 to-sky-50"
                  />
                  <Kpi
                    icon={<TrendingUp className="h-4 w-4" />}
                    label="Avg order"
                    value={`₹${stats.aov.toLocaleString("en-IN")}`}
                    sub="per order"
                    accent="from-emerald-100 to-emerald-50"
                  />
                </section>

                <section className="grid lg:grid-cols-3 gap-4">
                  <Panel className="lg:col-span-2" title="Revenue trend" subtitle="Last 14 days · confirmed orders">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueByDay}>
                          <defs>
                            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(40 55% 50%)" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="hsl(40 55% 50%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip contentStyle={tipStyle} />
                          <Area type="monotone" dataKey="revenue" stroke="hsl(40 55% 50%)" strokeWidth={2.5} fill="url(#rev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>

                  <Panel title="Order status" subtitle="Distribution across pipeline">
                    <div className="space-y-2.5 mt-2">
                      {statusBreakdown.map(s => {
                        const max = Math.max(1, ...statusBreakdown.map(x => x.count));
                        return (
                          <div key={s.status}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="flex items-center gap-2 capitalize">
                                <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[s.status as OrderStatus])} />
                                {s.status}
                              </span>
                              <span className="font-mono text-foreground">{s.count}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all", STATUS_DOT[s.status as OrderStatus])} style={{ width: `${(s.count / max) * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Panel>
                </section>

                <section className="grid lg:grid-cols-3 gap-4">
                  <Panel className="lg:col-span-2" title="Recent orders" subtitle="Latest 6 placed">
                    {recentOrders.length === 0 ? <Empty label="No orders yet" /> : (
                      <ul className="divide-y divide-border -mx-2">
                        {recentOrders.map(o => (
                          <li key={o.id} className="px-2 py-3 flex items-center gap-3 cursor-pointer hover:bg-muted/40 rounded-lg transition" onClick={() => setSelected(o)}>
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-accent/40 flex items-center justify-center font-serif text-sm">
                              {o.customer.name[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">{o.customer.name}</span>
                                <span className="font-mono text-[10px] text-muted-foreground">{o.id}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {o.items.length} item{o.items.length !== 1 ? "s" : ""} · {format(new Date(o.createdAt), "MMM d, p")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-serif">₹{o.total.toLocaleString("en-IN")}</p>
                              <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border", STATUS_COLORS[o.status])}>{o.status}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>

                  <Panel title="Top sellers" subtitle="By revenue">
                    {topProducts.length === 0 ? <Empty label="No sales yet" /> : (
                      <ul className="space-y-3 mt-2">
                        {topProducts.slice(0, 5).map((p, i) => (
                          <li key={p.name} className="flex items-center gap-3">
                            <span className="font-serif text-2xl text-muted-foreground/60 w-6">{i + 1}</span>
                            <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.qty} sold</p>
                            </div>
                            <p className="font-serif text-sm">₹{p.revenue.toLocaleString("en-IN")}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </section>
              </>
            )}

            {/* ORDERS */}
            {view === "orders" && (
              <Panel
                title={`${filtered.length} order${filtered.length !== 1 ? "s" : ""}`}
                subtitle="Click a row to view full details"
                action={
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" className="pl-9 w-48 sm:w-64" />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {STATUS_FLOW.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        <SelectItem value="cancelled">cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                }
              >
                {filtered.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground text-sm">
                    No orders {orders.length === 0 ? "yet — place one from the storefront." : "match your filters."}
                  </div>
                ) : (
                  <div className="-mx-2 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden md:table-cell">Date</TableHead>
                          <TableHead className="hidden sm:table-cell">Items</TableHead>
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
                              <div className="text-xs text-muted-foreground">{o.customer.city}</div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{format(new Date(o.createdAt), "MMM d, p")}</TableCell>
                            <TableCell className="hidden sm:table-cell">{o.items.reduce((s, i) => s + i.qty, 0)}</TableCell>
                            <TableCell className="font-serif">₹{o.total.toLocaleString("en-IN")}</TableCell>
                            <TableCell onClick={e => e.stopPropagation()}>
                              <Select value={o.status} onValueChange={(v) => handleStatusChange(o.id, v as OrderStatus)}>
                                <SelectTrigger className={cn("w-32 h-8 text-xs border", STATUS_COLORS[o.status])}>
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
                  </div>
                )}
              </Panel>
            )}

            {/* ANALYTICS */}
            {view === "analytics" && (
              <>
                <section className="grid lg:grid-cols-2 gap-4">
                  <Panel title="Revenue & orders" subtitle={`Last ${dateRange} days`}>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueByDay}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip contentStyle={tipStyle} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(40 55% 50%)" strokeWidth={2.5} dot={{ r: 3 }} />
                          <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(285 55% 55%)" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                  <Panel title="Revenue by category" subtitle="Bracelets · Pens · Keychains">
                    <div className="h-72">
                      {categoryBreakdown.length === 0 ? <Empty label="No sales yet" /> : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={4}>
                              {categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={tipStyle} formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </Panel>
                </section>
                <Panel title="Top products" subtitle="Ranked by revenue">
                  {topProducts.length === 0 ? <Empty label="No products sold yet" /> : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topProducts} layout="vertical" margin={{ left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={150} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip contentStyle={tipStyle} formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                          <Bar dataKey="revenue" fill="hsl(40 55% 50%)" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>
              </>
            )}

            {/* CUSTOMERS */}
            {view === "customers" && (
              <Panel title={`${customers.length} customer${customers.length !== 1 ? "s" : ""}`} subtitle="Sorted by lifetime spend">
                {customers.length === 0 ? <Empty label="No customers yet" /> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden sm:table-cell">Orders</TableHead>
                        <TableHead>Spent</TableHead>
                        <TableHead className="hidden md:table-cell">Last order</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map(c => (
                        <TableRow key={c.email}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-secondary to-accent/40 flex items-center justify-center font-serif text-sm">
                                {c.name[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{c.name}</div>
                                <div className="text-xs text-muted-foreground">{c.city}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                            <div>{c.email}</div>
                            <div>{c.phone}</div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{c.orders}</TableCell>
                          <TableCell className="font-serif">₹{c.spent.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{format(new Date(c.last), "MMM d, yyyy")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Panel>
            )}
          </main>
        </div>
      </div>

      {/* Order detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl flex items-center gap-3 flex-wrap">
                  Order {selected.id}
                  <Badge variant="outline" className={STATUS_COLORS[selected.status]}>{selected.status}</Badge>
                </DialogTitle>
                <DialogDescription>
                  Placed {format(new Date(selected.createdAt), "PPpp")} · Cash on Delivery
                </DialogDescription>
              </DialogHeader>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <DetailPanel title="Customer">
                  <P icon={<MapPin className="h-3.5 w-3.5" />}>{selected.customer.name}</P>
                  <P icon={<Mail className="h-3.5 w-3.5" />}>{selected.customer.email}</P>
                  <P icon={<Phone className="h-3.5 w-3.5" />}>{selected.customer.phone}</P>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selected.customer.address1}{selected.customer.address2 ? `, ${selected.customer.address2}` : ""}<br />
                    {selected.customer.city}, {selected.customer.state} – {selected.customer.pincode}
                  </p>
                </DetailPanel>
                <DetailPanel title="Gift details">
                  <P icon={<Gift className="h-3.5 w-3.5" />}>For: <strong>{selected.gift.recipientName || "—"}</strong></P>
                  <P icon={<Package className="h-3.5 w-3.5" />}>Wrap: {selected.gift.wrapStyle}</P>
                  {selected.gift.deliveryDate && (
                    <P icon={<Calendar className="h-3.5 w-3.5" />}>Deliver by: {format(new Date(selected.gift.deliveryDate), "PPP")}</P>
                  )}
                  {selected.gift.message && (
                    <div className="mt-2 rounded-lg bg-muted/60 p-2.5 text-xs italic">"{selected.gift.message}"</div>
                  )}
                </DetailPanel>
              </div>

              <DetailPanel title="Items" className="mt-4">
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
              </DetailPanel>

              <DetailPanel title="Status timeline" className="mt-4">
                <ol className="space-y-2">
                  {selected.history.map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className={cn("mt-1 h-2 w-2 rounded-full", i === selected.history.length - 1 ? "bg-primary" : "bg-muted-foreground/40")} />
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
              </DetailPanel>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const tipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
  fontSize: 12,
};

const Kpi = ({ icon, label, value, delta, sub, accent }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; delta?: number; sub?: string; accent?: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-soft">
    <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-60", accent)} />
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon} {label}
        </div>
        {delta !== undefined && (
          <span className={cn(
            "inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full",
            delta >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}>
            {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="font-serif text-3xl mt-3">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  </div>
);

const Panel = ({ title, subtitle, children, action, className = "" }: {
  title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode; className?: string;
}) => (
  <section className={cn("rounded-2xl border border-border bg-background p-5 shadow-soft", className)}>
    <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
      <div>
        <h3 className="font-serif text-lg leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const DetailPanel = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-xl border border-border bg-muted/20 p-4", className)}>
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
  <div className="h-full min-h-[8rem] flex items-center justify-center text-sm text-muted-foreground">{label}</div>
);

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-border bg-background/50 p-8 text-center">
    <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Sparkles className="h-5 w-5" />
    </div>
    <h3 className="font-serif text-2xl mt-3">No orders yet</h3>
    <p className="text-sm text-muted-foreground mt-1">Place a test order from the storefront to see it appear here.</p>
    <Link to="/" className="inline-block mt-4 rounded-full bg-foreground text-background px-5 py-2 text-sm">Go to storefront</Link>
  </div>
);

export default Admin;

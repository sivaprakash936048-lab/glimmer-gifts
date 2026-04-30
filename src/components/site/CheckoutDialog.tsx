import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from "@/store/cart";
import { createOrder } from "@/store/orders";
import { useState } from "react";
import { CalendarIcon, Check, Loader2, Truck, Gift, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const WRAP_STYLES = [
  { id: "blush-silk", label: "Blush silk + ivory ribbon" },
  { id: "navy-gold", label: "Navy paper + gold twine" },
  { id: "kraft-floral", label: "Kraft + dried floral" },
  { id: "pearl-velvet", label: "Pearl box + velvet bow" },
];

export const CheckoutDialog = ({ open, onOpenChange }: Props) => {
  const { items, total, clear, setOpen: setCartOpen } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState<{ id: string; total: number } | null>(null);
  const [date, setDate] = useState<Date | undefined>();

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address1: "", address2: "", city: "", state: "", pincode: "",
    recipientName: "", message: "", wrapStyle: WRAP_STYLES[0].id,
  });

  const shipping = total >= 2000 || total === 0 ? 0 : 80;
  const grand = total + shipping;

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const validateStep1 = () => {
    const required = ["name", "email", "phone", "address1", "city", "state", "pincode"] as const;
    for (const k of required) if (!form[k].trim()) { toast.error(`Please enter ${k}`); return false; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { toast.error("Invalid email"); return false; }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) { toast.error("Phone must be 10 digits"); return false; }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error("PIN code must be 6 digits"); return false; }
    return true;
  };

  const handlePlace = () => {
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        items: items.map(i => ({
          productId: i.product.id, name: i.product.name, category: i.product.category,
          price: i.product.price, qty: i.qty, image: i.product.image,
        })),
        subtotal: total, shipping, total: grand, payment: "cod",
        customer: {
          name: form.name, email: form.email, phone: form.phone,
          address1: form.address1, address2: form.address2,
          city: form.city, state: form.state, pincode: form.pincode,
        },
        gift: {
          recipientName: form.recipientName, message: form.message,
          wrapStyle: form.wrapStyle,
          deliveryDate: date ? format(date, "yyyy-MM-dd") : undefined,
        },
      });
      setProcessing(false);
      setConfirmed({ id: order.id, total: grand });
      clear();
      setCartOpen(false);
      toast.success("Order placed!", { description: `#${order.id} · Cash on Delivery` });
    }, 700);
  };

  const handleClose = (o: boolean) => {
    if (!o) { setStep(1); setConfirmed(null); }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-0 bg-background/98 backdrop-blur-xl shadow-float p-0">
        {confirmed ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="h-7 w-7" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center font-serif text-3xl">Order placed!</DialogTitle>
              <DialogDescription className="text-center">
                Pay ₹{confirmed.total.toLocaleString("en-IN")} on delivery. We'll wrap it with love.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 rounded-2xl glass p-4 shadow-soft">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Order ID</p>
              <p className="mt-1 font-serif text-2xl text-foreground">{confirmed.id}</p>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <Link to={`/track?id=${confirmed.id}`} className="flex-1 rounded-full bg-foreground py-3 text-sm text-background shadow-float">
                Track this order
              </Link>
              <button onClick={() => handleClose(false)} className="flex-1 rounded-full border border-border py-3 text-sm">
                Continue browsing
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <div className="flex-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={cn("flex items-center gap-1.5", step === 1 && "text-foreground")}>
                    <Truck className="h-3.5 w-3.5" /> Shipping
                  </span>
                  <span className="opacity-30">—</span>
                  <span className={cn("flex items-center gap-1.5", step === 2 && "text-foreground")}>
                    <Gift className="h-3.5 w-3.5" /> Gift wrap & review
                  </span>
                </div>
              </div>
              <DialogTitle className="font-serif text-3xl">
                {step === 1 ? "Where are we sending it?" : "Make it a gift"}
              </DialogTitle>
              <DialogDescription>
                {step === 1 ? "Cash on Delivery — pay when it arrives." : "Add a personal note that goes inside the gift box."}
              </DialogDescription>
            </DialogHeader>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Full name *"><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Aanya Sharma" /></Field>
                  <Field label="Email *"><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="aanya@email.com" /></Field>
                  <Field label="Phone *"><Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="9876543210" /></Field>
                  <Field label="PIN code *"><Input value={form.pincode} onChange={e => set("pincode", e.target.value)} placeholder="560001" /></Field>
                </div>
                <Field label="Address line 1 *"><Input value={form.address1} onChange={e => set("address1", e.target.value)} placeholder="Flat / House no., Street" /></Field>
                <Field label="Address line 2"><Input value={form.address2} onChange={e => set("address2", e.target.value)} placeholder="Landmark (optional)" /></Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="City *"><Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Bengaluru" /></Field>
                  <Field label="State *"><Input value={form.state} onChange={e => set("state", e.target.value)} placeholder="Karnataka" /></Field>
                </div>
                <button
                  onClick={() => validateStep1() && setStep(2)}
                  className="w-full mt-2 rounded-full bg-foreground py-3.5 text-sm text-background shadow-float hover:-translate-y-0.5 transition-transform"
                >
                  Continue · Gift wrap
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Field label="Recipient's name (printed on card)">
                  <Input value={form.recipientName} onChange={e => set("recipientName", e.target.value)} placeholder="For: Riya" />
                </Field>
                <Field label="Special message inside the box">
                  <Textarea
                    value={form.message}
                    onChange={e => set("message", e.target.value)}
                    placeholder="Happy birthday, sunshine — keep blooming. ✨"
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">{form.message.length}/300</p>
                </Field>

                <Field label="Gift wrap style">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {WRAP_STYLES.map(w => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => set("wrapStyle", w.id)}
                        className={cn(
                          "rounded-xl border p-3 text-left text-sm transition-colors",
                          form.wrapStyle === w.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                        )}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Preferred delivery date (optional)">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={cn(
                        "w-full inline-flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                        !date && "text-muted-foreground"
                      )}>
                        {date ? format(date, "PPP") : "Pick a date"}
                        <CalendarIcon className="h-4 w-4 opacity-60" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>

                <div className="rounded-2xl glass p-4 shadow-soft space-y-1.5 text-sm">
                  <Row label="Subtotal" value={`₹${total.toLocaleString("en-IN")}`} />
                  <Row label="Shipping" value={shipping === 0 ? "Free" : `₹${shipping}`} />
                  <Row label="Payment" value="Cash on Delivery" />
                  <div className="border-t border-border pt-2 mt-1">
                    <Row label={<span className="font-serif text-base">Total</span>} value={<span className="font-serif text-lg">₹{grand.toLocaleString("en-IN")}</span>} />
                  </div>
                </div>

                <button
                  onClick={handlePlace}
                  disabled={processing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm text-background shadow-float hover:-translate-y-0.5 transition-transform disabled:opacity-70"
                >
                  {processing
                    ? (<><Loader2 className="h-4 w-4 animate-spin" /> Placing order…</>)
                    : (<>Place order · COD ₹{grand.toLocaleString("en-IN")}</>)}
                </button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</Label>
    {children}
  </div>
);

const Row = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground">{value}</span>
  </div>
);

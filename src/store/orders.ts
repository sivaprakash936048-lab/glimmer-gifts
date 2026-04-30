import { Product } from "@/data/products";

export type OrderStatus = "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  category: Product["category"];
  price: number;
  qty: number;
  image: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderGift {
  recipientName: string;
  message: string;
  wrapStyle: string;
  deliveryDate?: string; // ISO yyyy-mm-dd
}

export interface StatusEvent {
  status: OrderStatus;
  at: string; // ISO datetime
  note?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: "cod";
  status: OrderStatus;
  customer: OrderCustomer;
  gift: OrderGift;
  history: StatusEvent[];
}

const KEY = "petal-orders";

export const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered"];

export const loadOrders = (): Order[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent("orders:updated"));
};

export const createOrder = (o: Omit<Order, "id" | "createdAt" | "status" | "history">): Order => {
  const id = "SGW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const now = new Date().toISOString();
  const order: Order = {
    ...o,
    id,
    createdAt: now,
    status: "pending",
    history: [{ status: "pending", at: now, note: "Order placed" }],
  };
  const all = loadOrders();
  saveOrders([order, ...all]);
  return order;
};

export const updateOrderStatus = (id: string, status: OrderStatus, note?: string) => {
  const all = loadOrders();
  const next = all.map(o => o.id === id ? {
    ...o,
    status,
    history: [...o.history, { status, at: new Date().toISOString(), note }],
  } : o);
  saveOrders(next);
};

export const findOrder = (id: string): Order | undefined =>
  loadOrders().find(o => o.id.toLowerCase() === id.toLowerCase());

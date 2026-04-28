import { CartProvider } from "@/store/cart";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Shop } from "@/components/site/Shop";
import { Story } from "@/components/site/Story";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Petal — A 3D Gift Boutique · Bracelets, Pens & Keychains";
    const meta = document.querySelector('meta[name="description"]') ?? document.head.appendChild(Object.assign(document.createElement("meta"), { name: "description" }));
    meta.setAttribute("content", "Petal is a 3D-first gift shop. Rotate, zoom and explore curated bracelets, pens and keychains in real time before you buy.");
  }, []);

  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <Shop />
        <Story />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
};

export default Index;

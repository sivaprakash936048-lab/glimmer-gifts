export type Category = "bracelets" | "pens" | "keychains";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  colors: string[];      // hex used in 3D + swatches
  material: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "br-aurora",
    name: "Aurora Bracelet",
    tagline: "Iridescent pearl chain",
    category: "bracelets",
    price: 48,
    colors: ["#f3c6dc", "#c9a0dc", "#fde6f0"],
    material: "Freshwater pearl · 14k gold-plate",
    description: "A delicate pearl bracelet that catches light like dawn — soft pinks fading into lavender.",
  },
  {
    id: "br-petal",
    name: "Petal Cuff",
    tagline: "Hand-forged blossom band",
    category: "bracelets",
    price: 62,
    colors: ["#e8c5d0", "#9b72cf", "#ffffff"],
    material: "Brushed silver · Enamel inlay",
    description: "Sculpted petals wrap the wrist in a quiet, modern cuff inspired by spring gardens.",
  },
  {
    id: "br-lumen",
    name: "Lumen Bangle",
    tagline: "Polished crystal halo",
    category: "bracelets",
    price: 56,
    colors: ["#f8e8ee", "#c9a0dc", "#b48cd9"],
    material: "Crystal · Rose gold",
    description: "A faceted crystal bangle that throws tiny rainbows across every gesture.",
  },
  {
    id: "pn-sonnet",
    name: "Sonnet Pen",
    tagline: "Weighted brass writer",
    category: "pens",
    price: 38,
    colors: ["#c9a0dc", "#9b72cf", "#f8e8ee"],
    material: "Solid brass · Soft-touch lacquer",
    description: "A balanced rollerball with a gentle hex grip — built for long letters and loved notes.",
  },
  {
    id: "pn-ribbon",
    name: "Ribbon Fountain",
    tagline: "Marbled resin fountain pen",
    category: "pens",
    price: 74,
    colors: ["#e8c5d0", "#f8e8ee", "#9b72cf"],
    material: "Hand-poured resin · Iridium nib",
    description: "Each barrel is poured by hand — no two ribbons of color ever match.",
  },
  {
    id: "pn-mira",
    name: "Mira Mini",
    tagline: "Pocket-sized everyday pen",
    category: "pens",
    price: 24,
    colors: ["#9b72cf", "#fde6f0", "#c9a0dc"],
    material: "Anodized aluminum",
    description: "A whisper-light everyday pen that clips neatly to any notebook.",
  },
  {
    id: "kc-clover",
    name: "Clover Charm",
    tagline: "Swinging four-leaf keyring",
    category: "keychains",
    price: 22,
    colors: ["#c9a0dc", "#e8c5d0", "#9b72cf"],
    material: "Enamel · Antique brass",
    description: "A tiny lucky charm that swings cheerfully with every step.",
  },
  {
    id: "kc-orbit",
    name: "Orbit Loop",
    tagline: "Sculpted ring carabiner",
    category: "keychains",
    price: 28,
    colors: ["#9b72cf", "#c9a0dc", "#f8e8ee"],
    material: "Machined aluminum",
    description: "A modern ring you'll actually want to show off — clips smartly to any bag.",
  },
  {
    id: "kc-bloom",
    name: "Bloom Tag",
    tagline: "Pressed-flower acrylic charm",
    category: "keychains",
    price: 18,
    colors: ["#fde6f0", "#e8c5d0", "#c9a0dc"],
    material: "Resin · Real pressed petals",
    description: "Real petals pressed into clear resin — a pocket of spring, year-round.",
  },
];

export const categoryLabel: Record<Category, string> = {
  bracelets: "Bracelets",
  pens: "Pens",
  keychains: "Keychains",
};

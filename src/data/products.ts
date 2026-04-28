import braceletSilver from "@/assets/products/bracelet-silver.jpg";
import braceletGold from "@/assets/products/bracelet-gold.jpg";
import penBlackGold from "@/assets/products/pen-black-gold.webp";
import keychainNameplate from "@/assets/products/keychain-nameplate.jpg";
import keychainCouple from "@/assets/products/keychain-couple.jpg";

export type Category = "bracelets" | "pens" | "keychains";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  colors: string[];      // hex used for swatches
  material: string;
  description: string;
  image: string;         // real product photo, animated in 3D
}

export const products: Product[] = [
  {
    id: "br-silver",
    name: "Silver Steel Bangle",
    tagline: "Brushed minimalist cuff",
    category: "bracelets",
    price: 48,
    colors: ["#d9dce0", "#a8acb1", "#ffffff"],
    material: "Brushed stainless steel",
    description: "A clean, polished bangle with a soft brushed finish — quiet luxury for everyday wear.",
    image: braceletSilver,
  },
  {
    id: "br-gold",
    name: "Gilded Halo Bangle",
    tagline: "High-polish gold band",
    category: "bracelets",
    price: 62,
    colors: ["#d4af37", "#f0d78c", "#8b6f1e"],
    material: "18k gold-plated steel",
    description: "A mirror-finish gold bangle with a confident weight — catches every flicker of light.",
    image: braceletGold,
  },
  {
    id: "pn-noir",
    name: "Noir & Gold Pen",
    tagline: "Matte black executive pen",
    category: "pens",
    price: 38,
    colors: ["#0d0d0d", "#d4af37", "#f0d78c"],
    material: "Matte lacquer · Gold trim",
    description: "A weighted matte-black ballpoint with gold accents — built for boardrooms and love letters alike.",
    image: penBlackGold,
  },
  {
    id: "kc-nameplate",
    name: "Personalised Nameplate",
    tagline: "Engraved metal keyring",
    category: "keychains",
    price: 22,
    colors: ["#c0c4c8", "#2a2a2a", "#ffffff"],
    material: "Polished zinc alloy",
    description: "A sleek rectangular keyring engraved with your name — a personal everyday companion.",
    image: keychainNameplate,
  },
  {
    id: "kc-couple",
    name: "I Know · I Love You",
    tagline: "Couple's matching set",
    category: "keychains",
    price: 28,
    colors: ["#b8bcc0", "#8a8e92", "#ffffff"],
    material: "Brushed stainless steel",
    description: "A pair of engraved bar keychains — a quiet promise carried in two pockets.",
    image: keychainCouple,
  },
];

export const categoryLabel: Record<Category, string> = {
  bracelets: "Bracelets",
  pens: "Pens",
  keychains: "Keychains",
};

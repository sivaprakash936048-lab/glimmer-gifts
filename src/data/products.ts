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
  price: number;       // INR
  colors: string[];
  material: string;
  description: string;
  image: string;
}

export const products: Product[] = [
  // ───────── Bracelets ─────────
  {
    id: "br-silver",
    name: "Silver Steel Bangle",
    tagline: "Brushed minimalist cuff",
    category: "bracelets",
    price: 1499,
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
    price: 1999,
    colors: ["#d4af37", "#f0d78c", "#8b6f1e"],
    material: "18k gold-plated steel",
    description: "A mirror-finish gold bangle with a confident weight — catches every flicker of light.",
    image: braceletGold,
  },
  {
    id: "br-rose",
    name: "Rose Gold Charm Cuff",
    tagline: "Dainty rose-gold charm",
    category: "bracelets",
    price: 1749,
    colors: ["#e8b4a0", "#f4cfc0", "#b87a64"],
    material: "Rose gold-plated brass",
    description: "A delicate cuff crowned with a tiny heart charm — soft romance for every wrist.",
    image: braceletGold,
  },
  {
    id: "br-duo",
    name: "Silver & Gold Duo",
    tagline: "Stackable two-tone set",
    category: "bracelets",
    price: 2499,
    colors: ["#d9dce0", "#d4af37", "#ffffff"],
    material: "Mixed metals · gift box",
    description: "A pair of complementary bangles meant to be stacked — modern minimalism, doubled.",
    image: braceletSilver,
  },
  {
    id: "br-beaded",
    name: "Pearl Whisper Bracelet",
    tagline: "Freshwater pearl strand",
    category: "bracelets",
    price: 1299,
    colors: ["#fdfcf7", "#e9e3d3", "#c0b39a"],
    material: "Freshwater pearls · silk",
    description: "Hand-knotted freshwater pearls on silk — old-world elegance, gently reimagined.",
    image: braceletGold,
  },

  // ───────── Pens ─────────
  {
    id: "pn-noir",
    name: "Noir & Gold Pen",
    tagline: "Matte black executive pen",
    category: "pens",
    price: 899,
    colors: ["#0d0d0d", "#d4af37", "#f0d78c"],
    material: "Matte lacquer · Gold trim",
    description: "A weighted matte-black ballpoint with gold accents — built for boardrooms and love letters alike.",
    image: penBlackGold,
  },
  {
    id: "pn-rosewood",
    name: "Rosewood Heritage Pen",
    tagline: "Hand-turned wooden barrel",
    category: "pens",
    price: 1199,
    colors: ["#5a2d1a", "#8b4a2b", "#d4af37"],
    material: "Indian rosewood · brass",
    description: "A warm rosewood barrel with brass fittings — a writing instrument that feels like an heirloom.",
    image: penBlackGold,
  },
  {
    id: "pn-pearl",
    name: "Pearl White Roller",
    tagline: "Glossy white rollerball",
    category: "pens",
    price: 749,
    colors: ["#fafafa", "#e8e8e8", "#c0c4c8"],
    material: "Pearl lacquer · chrome",
    description: "A soft pearl-white rollerball with chrome accents — clean lines, smooth ink, calm focus.",
    image: penBlackGold,
  },
  {
    id: "pn-twin-set",
    name: "His & Hers Pen Set",
    tagline: "Matched gift pair",
    category: "pens",
    price: 1599,
    colors: ["#0d0d0d", "#e8b4a0", "#d4af37"],
    material: "Lacquer pair · velvet box",
    description: "Two pens — noir and rose — nestled in a velvet gift box. A thoughtful pair for paired lives.",
    image: penBlackGold,
  },
  {
    id: "pn-fountain",
    name: "Midnight Fountain Pen",
    tagline: "Classic ink fountain",
    category: "pens",
    price: 1899,
    colors: ["#0a1530", "#1e2a52", "#d4af37"],
    material: "Resin · iridium nib",
    description: "A deep midnight-blue fountain pen with an iridium nib — for those who love the slow art of writing.",
    image: penBlackGold,
  },

  // ───────── Keychains ─────────
  {
    id: "kc-nameplate",
    name: "Personalised Nameplate",
    tagline: "Engraved metal keyring",
    category: "keychains",
    price: 499,
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
    price: 699,
    colors: ["#b8bcc0", "#8a8e92", "#ffffff"],
    material: "Brushed stainless steel",
    description: "A pair of engraved bar keychains — a quiet promise carried in two pockets.",
    image: keychainCouple,
  },
  {
    id: "kc-heart",
    name: "Twin Heart Keychain",
    tagline: "Interlocking hearts",
    category: "keychains",
    price: 549,
    colors: ["#e8b4a0", "#d4af37", "#ffffff"],
    material: "Rose gold-plated alloy",
    description: "Two tiny hearts that interlock — a small, hopeful symbol to carry every day.",
    image: keychainCouple,
  },
  {
    id: "kc-leather",
    name: "Vegan Leather Tag",
    tagline: "Soft leather + brass",
    category: "keychains",
    price: 449,
    colors: ["#6b3a2a", "#d4af37", "#3a2118"],
    material: "Vegan leather · brass",
    description: "A supple leather tag with a brass loop — quietly handsome, ages beautifully with use.",
    image: keychainNameplate,
  },
  {
    id: "kc-photo",
    name: "Mini Photo Locket Key",
    tagline: "Carry a tiny memory",
    category: "keychains",
    price: 799,
    colors: ["#d4af37", "#f0d78c", "#ffffff"],
    material: "Gold-plated locket",
    description: "A tiny locket keyring that opens to a photo of someone you love — pocket-sized affection.",
    image: keychainCouple,
  },
];

export const categoryLabel: Record<Category, string> = {
  bracelets: "Bracelets",
  pens: "Pens",
  keychains: "Keychains",
};

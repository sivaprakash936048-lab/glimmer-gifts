import braceletSilver from "@/assets/products/bracelet-silver.jpg";
import braceletGold from "@/assets/products/bracelet-gold.jpg";
import braceletRose from "@/assets/products/bracelet-rose.jpg";
import braceletDuo from "@/assets/products/bracelet-duo.jpg";
import braceletPearl from "@/assets/products/bracelet-pearl.jpg";
import braceletEvilEye from "@/assets/products/bracelet-evileye.jpg";
import braceletLeatherBr from "@/assets/products/bracelet-leather.jpg";
import braceletCharm from "@/assets/products/bracelet-charm.jpg";
import penBlackGold from "@/assets/products/pen-black-gold.webp";
import penRosewood from "@/assets/products/pen-rosewood.jpg";
import penPearlWhite from "@/assets/products/pen-pearl-white.jpg";
import penTwinSet from "@/assets/products/pen-twin-set.jpg";
import penFountainBlue from "@/assets/products/pen-fountain-blue.jpg";
import penEmerald from "@/assets/products/pen-emerald.jpg";
import penBamboo from "@/assets/products/pen-bamboo.jpg";
import penBlush from "@/assets/products/pen-blush.jpg";
import keychainNameplate from "@/assets/products/keychain-nameplate.jpg";
import keychainCouple from "@/assets/products/keychain-couple.jpg";
import keychainHeart from "@/assets/products/keychain-heart.jpg";
import keychainLeather from "@/assets/products/keychain-leather.jpg";
import keychainLocket from "@/assets/products/keychain-locket.jpg";
import keychainWoodLetter from "@/assets/products/keychain-wood-letter.jpg";
import keychainBear from "@/assets/products/keychain-bear.jpg";
import keychainCar from "@/assets/products/keychain-car.jpg";

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
    name: "Rose Gold Charm Chain",
    tagline: "Dainty rose-gold heart",
    category: "bracelets",
    price: 1749,
    colors: ["#e8b4a0", "#f4cfc0", "#b87a64"],
    material: "Rose gold-plated brass",
    description: "A delicate chain crowned with a tiny heart charm — soft romance for every wrist.",
    image: braceletRose,
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
    image: braceletDuo,
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
    image: braceletPearl,
  },
  {
    id: "br-evileye",
    name: "Evil Eye Charm Bracelet",
    tagline: "Protective blue charm",
    category: "bracelets",
    price: 999,
    colors: ["#4aa3df", "#d4af37", "#ffffff"],
    material: "Gold-plated brass · enamel",
    description: "A delicate gold chain dotted with turquoise beads and a tiny evil-eye charm — a quiet talisman for every day.",
    image: braceletEvilEye,
  },
  {
    id: "br-leather",
    name: "Braided Leather Cuff",
    tagline: "Magnetic clasp · unisex",
    category: "bracelets",
    price: 1099,
    colors: ["#1a1a1a", "#3a2118", "#c0c4c8"],
    material: "Genuine leather · steel clasp",
    description: "A hand-braided black leather cuff with a polished magnetic clasp — understated and effortless.",
    image: braceletLeatherBr,
  },
  {
    id: "br-charm",
    name: "Celestial Charm Bangle",
    tagline: "Stars, moon & initial",
    category: "bracelets",
    price: 1349,
    colors: ["#d9dce0", "#a8acb1", "#c9a0dc"],
    material: "Sterling silver-plated",
    description: "A slim silver bangle adorned with dangling celestial charms — a tiny constellation around your wrist.",
    image: braceletCharm,
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
    image: penRosewood,
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
    image: penPearlWhite,
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
    image: penTwinSet,
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
    image: penFountainBlue,
  },
  {
    id: "pn-emerald",
    name: "Emerald Lacquer Pen",
    tagline: "Glossy green statement pen",
    category: "pens",
    price: 849,
    colors: ["#1f8a4c", "#2dd47a", "#c0c4c8"],
    material: "Glossy lacquer · chrome",
    description: "A vivid emerald-green ballpoint with mirror chrome accents — bold colour, smooth glide.",
    image: penEmerald,
  },
  {
    id: "pn-bamboo",
    name: "Bamboo Eco Pen",
    tagline: "Sustainable wood barrel",
    category: "pens",
    price: 599,
    colors: ["#cdb380", "#8b6f3a", "#c0c4c8"],
    material: "Natural bamboo · steel",
    description: "A lightweight bamboo barrel pen — eco-friendly, biodegradable, and beautifully grained.",
    image: penBamboo,
  },
  {
    id: "pn-blush",
    name: "Blush Rose Pen",
    tagline: "Soft pink with rose gold",
    category: "pens",
    price: 799,
    colors: ["#f8c8d8", "#e8b4a0", "#d4af37"],
    material: "Lacquer · rose gold trim",
    description: "A delicate blush-pink pen with warm rose-gold accents — quiet femininity in your hand.",
    image: penBlush,
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
    image: keychainHeart,
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
    image: keychainLeather,
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
    image: keychainLocket,
  },
  {
    id: "kc-wood-letter",
    name: "Wooden Initial Keychain",
    tagline: "Personalised letter charm",
    category: "keychains",
    price: 399,
    colors: ["#a0712b", "#cdb380", "#c0c4c8"],
    material: "Polished oak · steel ring",
    description: "Your initial, hand-cut from warm oak with a polished steel ring — a small daily signature.",
    image: keychainWoodLetter,
  },
  {
    id: "kc-bear",
    name: "Pink Teddy Keychain",
    tagline: "Cute resin bear charm",
    category: "keychains",
    price: 349,
    colors: ["#f4a8c0", "#f8c8d8", "#c0c4c8"],
    material: "Resin · steel ring",
    description: "A tiny pink teddy that hangs from your bag — a small, cheerful companion that travels with you.",
    image: keychainBear,
  },
  {
    id: "kc-car",
    name: "Plush Car Keychain",
    tagline: "Soft fur car charm",
    category: "keychains",
    price: 449,
    colors: ["#b8d4e8", "#e0f2fe", "#2a2a2a"],
    material: "Faux fur · steel ring",
    description: "A soft pastel-blue plush car keychain — playful, fluffy, impossible not to smile at.",
    image: keychainCar,
  },
];

export const categoryLabel: Record<Category, string> = {
  bracelets: "Bracelets",
  pens: "Pens",
  keychains: "Keychains",
};

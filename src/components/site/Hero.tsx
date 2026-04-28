import { HeroScene } from "@/components/three/HeroScene";
import { ArrowRight, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

export const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-hero">
      {/* Floating decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-secondary/60 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-accent/50 blur-3xl animate-float" />

      <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-20 md:pt-48">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2.5 rounded-full glass px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground shadow-soft">
              <img src={logo} alt="" className="h-5 w-5 object-contain" />
              <span>Swapn's Gift World · est. 2026</span>
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <h1 className="mt-6 font-serif text-5xl leading-[0.95] text-foreground text-balance md:text-7xl lg:text-8xl">
              Tiny gifts,<br />
              <em className="text-primary">held in light.</em>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Hand-curated bracelets, pens and keychains — explored in immersive 3D before they ever reach your door.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#shop"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm text-background shadow-float transition-transform hover:-translate-y-0.5"
              >
                Explore the shop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#story"
                className="story-link inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm text-foreground"
              >
                Our craft
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <div><div className="font-serif text-3xl text-foreground normal-case tracking-normal">120+</div>curated pieces</div>
              <div><div className="font-serif text-3xl text-foreground normal-case tracking-normal">3D</div>real-time view</div>
              <div><div className="font-serif text-3xl text-foreground normal-case tracking-normal">Free</div>gift wrap</div>
            </div>
          </div>

          <div className="relative h-[460px] md:h-[600px] animate-scale-in">
            <HeroScene className="absolute inset-0" />
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative border-y border-border/60 bg-background/40 backdrop-blur-sm py-4 overflow-hidden">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap font-serif text-2xl italic text-muted-foreground">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-16">
              <span>· hand-poured resin</span>
              <span>· 14k gold-plate</span>
              <span>· freshwater pearls</span>
              <span>· pressed petals</span>
              <span>· small-batch</span>
              <span>· wrapped with care</span>
              <span>· hand-poured resin</span>
              <span>· 14k gold-plate</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

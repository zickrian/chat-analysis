import React from "react";
import { ChevronDown, ChevronRight, Crosshair } from "lucide-react";

// --- STYLES ---
// Menggunakan style block untuk custom properties, font import, dan efek liquid glass
const styles = `
  @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/400.css');
  @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/500.css');
  @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/600.css');
  @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/700.css');

  :root {
    --background: 260 87% 3%;
    --foreground: 40 6% 95%;
    --primary: 121 95% 76%;
    --primary-foreground: 0 0% 5%;
    --hero-heading: 40 10% 96%;
    --hero-sub: 40 6% 82%;
    --muted: 240 4% 16%;
    --border: 240 4% 20%;
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: 'Geist Sans', sans-serif;
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }

  /* Liquid Glass Utility */
  .liquid-glass {
    position: relative;
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    overflow: hidden;
    isolation: isolate;
  }

  .liquid-glass::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
      rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
      rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: -1;
  }

  /* Marquee Animation */
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 20s linear infinite;
  }
`;

// --- COMPONENTS ---

const buttonVariants = {
  hero: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full px-6 py-3 text-base font-medium hover:opacity-90 transition-opacity whitespace-nowrap",
  heroSecondary:
    "liquid-glass text-[hsl(var(--foreground))] rounded-full px-6 py-3 text-base font-normal hover:bg-white/5 transition-colors whitespace-nowrap",
};

const brands = ["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"];

export default function App() {
  return (
    <>
      <style>{styles}</style>

      <main className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[hsl(var(--background))] selection:bg-[hsl(var(--primary))] selection:text-[hsl(var(--primary-foreground))]">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260309_042944_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4"
            type="video/mp4"
          />
        </video>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col flex-grow w-full h-full">
          {/* Navbar */}
          <nav className="w-full flex justify-center pt-6 px-4">
            <div className="liquid-glass rounded-3xl w-full max-w-[850px] flex items-center justify-between px-4 py-3">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                  <Crosshair className="w-4 h-4 text-[hsl(var(--foreground))]" />
                </div>
                <span className="text-xl font-semibold tracking-wide text-[hsl(var(--foreground))]">
                  APEX
                </span>
              </div>

              {/* Nav Items */}
              <div className="hidden md:flex items-center gap-8">
                <button className="flex items-center gap-1 text-base text-[hsl(var(--foreground))]/90 hover:text-[hsl(var(--foreground))] transition-colors">
                  Features <ChevronDown className="w-4 h-4 opacity-70" />
                </button>
                <button className="text-base text-[hsl(var(--foreground))]/90 hover:text-[hsl(var(--foreground))] transition-colors">
                  Solutions
                </button>
                <button className="text-base text-[hsl(var(--foreground))]/90 hover:text-[hsl(var(--foreground))] transition-colors">
                  Plans
                </button>
                <button className="flex items-center gap-1 text-base text-[hsl(var(--foreground))]/90 hover:text-[hsl(var(--foreground))] transition-colors">
                  Learning <ChevronDown className="w-4 h-4 opacity-70" />
                </button>
              </div>

              {/* CTA */}
              <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
                Sign Up
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4 mt-16 mb-24 md:mb-32">
            {/* Announcement Badge */}
            <div className="liquid-glass rounded-full p-1 pr-3 flex items-center gap-3 mb-8 cursor-pointer group">
              <div className="bg-white/5 text-[hsl(var(--foreground))] text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                Nova+ Launched!
              </div>
              <div className="flex items-center gap-1 text-sm text-[hsl(var(--foreground))]/80 group-hover:text-[hsl(var(--foreground))] transition-colors">
                Explore <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] max-w-5xl text-[hsl(var(--hero-heading))] mb-6">
              Accelerate Your
              <br className="hidden sm:block" /> Revenue Growth Now
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-[hsl(var(--hero-sub))] max-w-md opacity-80 mb-10 leading-relaxed text-balance">
              Drive your funnel forward with clever workflows, analytics, and
              seamless lead management.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className={buttonVariants.hero}>
                Start Free Right Now
              </button>
              <button className={buttonVariants.heroSecondary}>
                Schedule a Consult
              </button>
            </div>
          </div>

          {/* Social Proof Marquee */}
          <div className="w-full border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 backdrop-blur-md py-5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <p className="text-sm text-[hsl(var(--foreground))]/50 whitespace-nowrap font-medium uppercase tracking-wider">
                Relied on by brands across the globe
              </p>

              {/* Marquee Container */}
              <div className="flex-1 relative overflow-hidden flex items-center w-full mask-image-linear-gradient">
                <div className="flex animate-marquee w-max items-center gap-12 pl-12">
                  {/* Duplicated for seamless loop */}
                  {[...brands, ...brands].map((brand, i) => (
                    <div key={i} className="flex items-center gap-3 shrink-0">
                      <div className="liquid-glass w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-[hsl(var(--foreground))]">
                        {brand.charAt(0)}
                      </div>
                      <span className="text-base font-semibold text-[hsl(var(--foreground))]/80">
                        {brand}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fade out edges of the marquee */}
      <style>{`
        .mask-image-linear-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </>
  );
}

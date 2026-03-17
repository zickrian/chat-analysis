import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Upload, ChartColumnBig, Sparkles, MessageCircle } from "lucide-react";

const styles = `
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

  .theme-dark {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
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
`;

const buttonVariants = {
  hero: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full px-6 py-3 text-base font-medium hover:opacity-90 transition-opacity whitespace-nowrap",
  heroSecondary: "liquid-glass text-[hsl(var(--foreground))] rounded-full px-6 py-3 text-base font-normal hover:bg-white/5 transition-colors whitespace-nowrap",
};

export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="theme-dark relative min-h-screen w-full flex flex-col overflow-hidden selection:bg-[hsl(var(--primary))] selection:text-[hsl(var(--primary-foreground))]">
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
                  <MessageCircle className="w-4 h-4 text-[hsl(var(--foreground))]" />
                </div>
                <span className="text-xl font-semibold tracking-wide text-[hsl(var(--foreground))]">
                  Chat Wrapped
                </span>
              </div>

              {/* Nav Items */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-base text-[hsl(var(--foreground))]/90 hover:text-[hsl(var(--foreground))] transition-colors">
                  Features
                </a>
                <a href="#privacy" className="text-base text-[hsl(var(--foreground))]/90 hover:text-[hsl(var(--foreground))] transition-colors">
                  Privacy
                </a>
              </div>

              {/* CTA */}
              <Link href="/upload" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
                Upload Chat
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4 mt-16 mb-24 md:mb-32">
            {/* Announcement Badge */}
            <div className="liquid-glass rounded-full p-1 pr-3 flex items-center gap-3 mb-8 cursor-pointer group">
              <div className="bg-white/5 text-[hsl(var(--foreground))] text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                New AI Insights!
              </div>
              <div className="flex items-center gap-1 text-sm text-[hsl(var(--foreground))]/80 group-hover:text-[hsl(var(--foreground))] transition-colors">
                Discover <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] max-w-5xl text-[hsl(var(--hero-heading))] mb-6">
              Discover Your
              <br className="hidden sm:block" /> WhatsApp Chat Wrapped
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-[hsl(var(--hero-sub))] max-w-2xl opacity-80 mb-10 leading-relaxed text-balance">
              Upload your WhatsApp export and get deep insights about your conversations. See who ghosts the most, your peak chat hours, and let AI reveal your relationship dynamics.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/upload" className={buttonVariants.hero}>
                Analyze My Chat
              </Link>
              <a href="#features" className={buttonVariants.heroSecondary}>
                See Features
              </a>
            </div>
          </div>

          {/* Features / Highlights */}
          <div id="features" className="w-full border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 backdrop-blur-md py-12 px-6">
            <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="liquid-glass rounded-2xl p-6">
                <Upload className="h-6 w-6 text-[hsl(var(--primary))]" />
                <h3 className="mt-4 text-lg font-medium text-[hsl(var(--foreground))]">Easy Upload</h3>
                <p className="mt-2 text-sm text-[hsl(var(--foreground))]/70">Simple upload flow with .txt or .zip files directly from WhatsApp export.</p>
              </div>
              <div className="liquid-glass rounded-2xl p-6">
                <ChartColumnBig className="h-6 w-6 text-[hsl(var(--primary))]" />
                <h3 className="mt-4 text-lg font-medium text-[hsl(var(--foreground))]">Deep Analytics</h3>
                <p className="mt-2 text-sm text-[hsl(var(--foreground))]/70">Heatmaps, ghosting index, double text counts, and word dictionaries.</p>
              </div>
              <div className="liquid-glass rounded-2xl p-6">
                <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
                <h3 className="mt-4 text-lg font-medium text-[hsl(var(--foreground))]">AI Insights</h3>
                <p className="mt-2 text-sm text-[hsl(var(--foreground))]/70">AI analyzes relationship dynamics, tone, and your very first encounter.</p>
              </div>
              <div id="privacy" className="liquid-glass rounded-2xl p-6">
                <ShieldCheck className="h-6 w-6 text-[hsl(var(--primary))]" />
                <h3 className="mt-4 text-lg font-medium text-[hsl(var(--foreground))]">100% Private</h3>
                <p className="mt-2 text-sm text-[hsl(var(--foreground))]/70">No database. Chats are processed in temporary memory and auto-deleted.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
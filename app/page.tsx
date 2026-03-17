import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Upload, ChartColumnBig, Sparkles } from "lucide-react";

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
          {/* Hero Section */}
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32">
            {/* Announcement Badge */}
            <div className="group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pr-4 text-sm backdrop-blur-md transition-colors hover:bg-white/10 mb-8 cursor-pointer">
              <span className="rounded-full bg-[hsl(var(--primary))] px-3 py-1 font-medium text-[hsl(var(--primary-foreground))]">
                New
              </span>
              <span className="text-[hsl(var(--foreground))]/90">AI Insights Available</span>
              <ChevronRight className="h-4 w-4 text-[hsl(var(--foreground))]/50 transition-transform group-hover:translate-x-0.5 group-hover:text-[hsl(var(--foreground))]" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-5xl text-[hsl(var(--hero-heading))] mb-8 drop-shadow-sm">
              Discover Your
              <br className="hidden sm:block" /> WhatsApp Chat Wrapped
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-[hsl(var(--hero-sub))] max-w-2xl opacity-90 mb-12 leading-relaxed text-balance">
              Upload your WhatsApp export and get deep insights about your conversations. See who ghosts the most, your peak chat hours, and let AI reveal your relationship dynamics.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/upload" className="rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-4 text-lg font-semibold shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:scale-105 hover:shadow-[0_0_60px_-15px_hsl(var(--primary))] transition-all duration-300">
                Analyze My Chat
              </Link>
              <a href="#features" className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium text-[hsl(var(--foreground))] backdrop-blur-md transition-all hover:bg-white/10 hover:text-white">
                See Features
              </a>
            </div>
          </div>

          {/* Features / Highlights */}
          <div id="features" className="relative w-full px-6 py-24">
            {/* Soft Gradient Fade for smooth transition from video */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--background))]/80 to-[hsl(var(--background))] -z-10 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {/* Card 1 */}
              <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[hsl(var(--primary))]/10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]/30 group-hover:ring-[hsl(var(--primary))]/60 transition-all">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-3">Easy Upload</h3>
                <p className="text-sm text-[hsl(var(--foreground))]/70 leading-relaxed">Simple upload flow with .txt or .zip files directly from WhatsApp export. No technical skills required.</p>
              </div>
              
              {/* Card 2 */}
              <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[hsl(var(--primary))]/10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]/30 group-hover:ring-[hsl(var(--primary))]/60 transition-all">
                  <ChartColumnBig className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-3">Deep Analytics</h3>
                <p className="text-sm text-[hsl(var(--foreground))]/70 leading-relaxed">Visualize your chat with heatmaps, ghosting index, double text counts, and personalized word dictionaries.</p>
              </div>

              {/* Card 3 */}
              <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[hsl(var(--primary))]/10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]/30 group-hover:ring-[hsl(var(--primary))]/60 transition-all">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-3">AI Insights</h3>
                <p className="text-sm text-[hsl(var(--foreground))]/70 leading-relaxed">Let AI analyze your relationship dynamics, conversation tone, and uncover details about your first encounter.</p>
              </div>

              <div id="privacy" className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[hsl(var(--primary))]/10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]/30 group-hover:ring-[hsl(var(--primary))]/60 transition-all">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-3">100% Private</h3>
                <p className="text-sm text-[hsl(var(--foreground))]/70 leading-relaxed">No database storage. Chats are processed entirely in temporary memory and auto-deleted immediately after.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import React from "react";
import Link from "next/link";
import { ShieldCheck, Upload, ChartColumnBig, Sparkles, MoveRight } from "lucide-react";

const styles = `
  :root {
    --color-bg-base: #f3f0e6;
    --color-bg-muted: #ece6d8;
    --color-surface-strong: #fffdf8;
    --color-text-main: #213228;
    --color-text-soft: rgba(33, 50, 40, 0.72);
    --color-accent: #4d6a37;
    --color-border: rgba(33, 50, 40, 0.1);
    --font-display: var(--font-mondwest), serif;
    --font-sans: var(--font-space), sans-serif;
  }

  body {
    background-color: var(--color-bg-base);
    color: var(--color-text-main);
    font-family: var(--font-sans);
  }

  .font-display {
    font-family: var(--font-display);
    font-weight: normal;
  }

  .font-sans {
    font-family: var(--font-sans);
  }

  .editorial-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    border: 1px solid var(--color-border);
    background: rgba(255, 252, 245, 0.82);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
  }

  .button-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    padding: 1rem 2rem;
    border-radius: 999px;
    background: var(--color-text-main);
    color: var(--color-bg-base);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: all 300ms ease;
  }
  .button-primary:hover {
    background: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(77, 106, 55, 0.2);
  }

  .button-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    padding: 1rem 2rem;
    border-radius: 999px;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text-main);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: all 300ms ease;
  }
  .button-secondary:hover {
    background: var(--color-surface-strong);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .soft-grid-bg {
    background-color: var(--color-bg-base);
    background-image:
      linear-gradient(rgba(33, 50, 40, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(33, 50, 40, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .editorial-card {
    background: var(--color-surface-strong);
    border: 1px solid var(--color-border);
    border-radius: 24px;
    transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .editorial-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(33, 50, 40, 0.06);
    border-color: rgba(77, 106, 55, 0.3);
  }

  .arch-window {
    border-radius: 240px 240px 16px 16px;
    overflow: hidden;
    position: relative;
    background: #111a14;
    box-shadow: 0 24px 60px rgba(33, 50, 40, 0.15);
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .arch-window::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
    pointer-events: none;
  }
`;

export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="soft-grid-bg min-h-screen relative overflow-hidden selection:bg-[var(--color-accent)] selection:text-[var(--color-surface-strong)]">
        
        <main className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-24 min-h-[90vh] flex items-center">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center w-full">
            
            {/* Left Col: Content */}
            <div className="lg:col-span-6 flex flex-col items-start z-10">
              <div className="editorial-pill mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                Volume I: AI Insights Edition
              </div>
              
              <h1 className="font-display text-6xl sm:text-7xl lg:text-[6rem] leading-[0.9] mb-8 tracking-[-0.02em] text-[var(--color-text-main)]">
                Uncover the <br className="hidden sm:block" />
                <span className="italic text-[var(--color-accent)] pr-2">narrative</span> of <br className="hidden sm:block" />
                your chats.
              </h1>
              
              <p className="text-[var(--color-text-soft)] text-lg sm:text-xl max-w-lg mb-12 leading-relaxed font-sans font-medium">
                Upload your WhatsApp export and receive a beautifully curated editorial analysis of your conversations. Discover hidden dynamics, peak hours, and who really texts more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/upload" className="button-primary group">
                  Analyze Export <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="button-secondary">
                  View Index
                </a>
              </div>

              <div className="mt-16 flex items-start sm:items-center gap-4 text-sm text-[var(--color-text-soft)] font-sans">
                <div className="flex -space-x-2 pt-1 sm:pt-0">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--color-bg-base)] bg-[var(--color-surface-strong)] flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
                    </div>
                  ))}
                </div>
                <p className="font-medium leading-tight">
                  Absolute Privacy. Local-first processing.<br/>
                  No database storage ever.
                </p>
              </div>
            </div>

            {/* Right Col: Creative Earth Video inside Arch */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
              {/* Decorative soft glow behind arch */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-accent)] opacity-5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="arch-window w-full max-w-[460px] aspect-[4/5] relative transform md:rotate-2 hover:rotate-0 transition-all duration-700 ease-out group">
                <video
                  className="absolute inset-0 w-full h-[110%] object-cover object-[center_60%] mix-blend-screen opacity-85 transition-transform duration-1000 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ filter: 'contrast(1.1) saturate(1.2)' }}
                >
                  <source
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260309_042944_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4"
                    type="video/mp4"
                  />
                </video>
                
                {/* Overlay gradient inside arch for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111a14] via-[#111a14]/20 to-transparent opacity-90" />
                
                {/* Subtle text inside the arch */}
                <div className="absolute bottom-10 left-10 right-10 text-[#f3f0e6] font-sans">
                   <div className="text-xs tracking-[0.2em] font-bold uppercase mb-3 opacity-70 text-[var(--color-accent)] flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" /> Global Reach
                   </div>
                   <div className="font-display text-3xl leading-snug">
                     Your data, beautifully mapped & processed locally.
                   </div>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* Features Section - Editorial Grid */}
        <section id="features" className="w-full bg-[var(--color-surface-strong)] border-t border-[var(--color-border)] py-24 z-20 relative">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <h2 className="font-display text-4xl md:text-5xl mb-4 text-[var(--color-text-main)]">The Index</h2>
                <p className="font-sans text-[var(--color-text-soft)] text-lg max-w-md font-medium">Everything you need to understand your digital relationships, presented in a clean, editorial format.</p>
              </div>
              <div className="text-sm font-sans font-bold tracking-[0.2em] uppercase text-[var(--color-text-soft)] opacity-60">
                Chapter — 01
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="editorial-card p-8 flex flex-col group cursor-default">
                <div className="mb-10 w-14 h-14 rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg-base)] group-hover:bg-[var(--color-text-main)] group-hover:text-[var(--color-bg-base)] group-hover:border-[var(--color-text-main)] transition-all duration-300">
                  <Upload className="w-6 h-6 text-[var(--color-accent)] group-hover:text-[var(--color-bg-base)] transition-colors" />
                </div>
                <h3 className="font-display text-3xl mb-4 text-[var(--color-text-main)] group-hover:text-[var(--color-accent)] transition-colors">Seamless</h3>
                <p className="font-sans text-base text-[var(--color-text-soft)] font-medium leading-relaxed">Instantly process raw .txt or .zip exports from WhatsApp. No technical expertise required.</p>
              </div>
              
              <div className="editorial-card p-8 flex flex-col group cursor-default">
                <div className="mb-10 w-14 h-14 rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg-base)] group-hover:bg-[var(--color-text-main)] group-hover:text-[var(--color-bg-base)] group-hover:border-[var(--color-text-main)] transition-all duration-300">
                  <ChartColumnBig className="w-6 h-6 text-[var(--color-accent)] group-hover:text-[var(--color-bg-base)] transition-colors" />
                </div>
                <h3 className="font-display text-3xl mb-4 text-[var(--color-text-main)] group-hover:text-[var(--color-accent)] transition-colors">Metrics</h3>
                <p className="font-sans text-base text-[var(--color-text-soft)] font-medium leading-relaxed">Visualize ghosting rates, double-text tendencies, and chronological heatmaps of your activity.</p>
              </div>

              <div className="editorial-card p-8 flex flex-col group cursor-default">
                <div className="mb-10 w-14 h-14 rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg-base)] group-hover:bg-[var(--color-text-main)] group-hover:text-[var(--color-bg-base)] group-hover:border-[var(--color-text-main)] transition-all duration-300">
                  <Sparkles className="w-6 h-6 text-[var(--color-accent)] group-hover:text-[var(--color-bg-base)] transition-colors" />
                </div>
                <h3 className="font-display text-3xl mb-4 text-[var(--color-text-main)] group-hover:text-[var(--color-accent)] transition-colors">Intelligence</h3>
                <p className="font-sans text-base text-[var(--color-text-soft)] font-medium leading-relaxed">Let local AI synthesize your relationship dynamics, tone, and the story of your first encounter.</p>
              </div>

              <div id="privacy" className="editorial-card p-8 flex flex-col group cursor-default">
                <div className="mb-10 w-14 h-14 rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg-base)] group-hover:bg-[var(--color-text-main)] group-hover:text-[var(--color-bg-base)] group-hover:border-[var(--color-text-main)] transition-all duration-300">
                  <ShieldCheck className="w-6 h-6 text-[var(--color-accent)] group-hover:text-[var(--color-bg-base)] transition-colors" />
                </div>
                <h3 className="font-display text-3xl mb-4 text-[var(--color-text-main)] group-hover:text-[var(--color-accent)] transition-colors">Privacy</h3>
                <p className="font-sans text-base text-[var(--color-text-soft)] font-medium leading-relaxed">Your data never leaves your browser. Processed entirely in temporary memory and auto-deleted.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
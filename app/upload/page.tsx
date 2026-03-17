import Link from "next/link";
import { UploadForm } from "@/components/upload/upload-form";
import { MoveLeft } from "lucide-react";

const styles = `
  :root {
    --color-bg-base: #f3f0e6;
    --color-bg-muted: #ece6d8;
    --color-surface-strong: #fffdf8;
    --color-surface-soft: rgba(255, 252, 245, 0.78);
    --color-text-main: #213228;
    --color-text-soft: rgba(33, 50, 40, 0.72);
    --color-accent: #4d6a37;
    --color-accent-soft: rgba(77, 106, 55, 0.1);
    --color-border: rgba(33, 50, 40, 0.1);
    --color-border-strong: rgba(33, 50, 40, 0.18);
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
    box-shadow: 0 18px 40px rgba(28, 31, 29, 0.04);
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
`;

export default function UploadPage() {
  return (
    <>
      <style>{styles}</style>
      <div className="soft-grid-bg min-h-screen relative overflow-hidden selection:bg-[var(--color-accent)] selection:text-[var(--color-surface-strong)] flex flex-col">
        
        {/* Minimal Header */}
        <header className="w-full p-6 lg:px-12 z-50 flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-3 text-sm font-sans font-bold uppercase tracking-widest text-[var(--color-text-main)] hover:text-[var(--color-accent)] transition-colors">
            <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Index
          </Link>
          <div className="font-display text-xl tracking-wide text-[var(--color-text-main)] opacity-50">
            Chapter — 02
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-20 z-10">
          <div className="w-full max-w-[1100px] grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-5 flex flex-col pt-4">
              <div className="editorial-pill mb-8 self-start">
                Secure & Local
              </div>
              
              <h1 className="font-display text-5xl lg:text-[4.5rem] leading-[0.9] mb-6 tracking-[-0.02em] text-[var(--color-text-main)]">
                Submit <br/> your archive.
              </h1>
              
              <p className="text-[var(--color-text-soft)] text-lg leading-relaxed font-sans font-medium mb-10">
                Upload your WhatsApp chat export in <span className="text-[var(--color-text-main)] border-b border-[var(--color-border-strong)]">.txt</span> or <span className="text-[var(--color-text-main)] border-b border-[var(--color-border-strong)]">.zip</span> format. Your conversation data never leaves your device and is processed entirely in temporary memory.
              </p>

              <div className="editorial-card !bg-transparent !shadow-none p-6 mt-auto">
                <h3 className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-main)] mb-4">
                  The Process
                </h3>
                <ul className="space-y-4 font-sans text-sm font-medium text-[var(--color-text-soft)]">
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-accent)]">01.</span>
                    Local parsing & extraction
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-accent)]">02.</span>
                    Pattern & timeline computation
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-accent)]">03.</span>
                    AI relationship synthesis
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-accent)]">04.</span>
                    Editorial dashboard generation
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="lg:col-span-7 w-full">
              <div className="editorial-card p-6 md:p-10 relative overflow-hidden group">
                {/* Decorative soft glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-accent)] opacity-[0.03] blur-[60px] rounded-full pointer-events-none" />
                
                <UploadForm />
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
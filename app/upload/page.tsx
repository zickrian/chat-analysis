import Link from "next/link";
import { UploadForm } from "@/components/upload/upload-form";
import { MoveLeft } from "lucide-react";

export default function UploadPage() {
  return (
    <>
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
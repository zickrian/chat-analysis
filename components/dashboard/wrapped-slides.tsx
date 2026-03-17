"use client";

import { useMemo, useState, useEffect } from "react";
import { AnalysisResult } from "@/lib/types";
import { clsx } from "clsx";

type Props = {
  report: AnalysisResult;
};

export function WrappedSlides({ report }: Props) {
  const slides = useMemo(() => {
    return [
      {
        kicker: "The Beginning",
        title: "Your Chat Wrapped",
        body: `A deep dive into your messages, extracted from ${report.meta.fileName}.`,
        bg: "bg-[var(--color-surface)]",
        align: "items-start text-left",
      },
      {
        kicker: "Volume",
        title: `${report.wrapped.messagesSent.toLocaleString()} Messages`,
        body: `You really had a lot to say this year. Some would call it chatting, others might call it a full-time job.`,
        bg: "bg-[var(--color-surface-soft)]",
        align: "items-center text-center",
      },
      {
        kicker: "The Main Character",
        title: report.totals.mostActiveUser,
        body: `Carried the conversation on their back.`,
        bg: "bg-[var(--color-accent-soft)]",
        align: "items-start text-left",
      },
      {
        kicker: "Timing is Everything",
        title: report.wrapped.peakHourLabel,
        body: `The witching hour. This is when your chats peaked and the real conversations happened.`,
        bg: "bg-[var(--color-surface-strong)]",
        align: "items-center text-center",
      },
      {
        kicker: "Favorite Emoji",
        title: report.wrapped.favoriteEmoji,
        body: `Because sometimes words just aren't enough.`,
        bg: "bg-[var(--color-surface-soft)]",
        align: "items-center text-center text-8xl", // Make emoji huge if it's just the emoji
      },
      {
        kicker: "Topics",
        title: report.wrapped.topTopics.join(", ") || "Everything under the sun",
        body: `The things you couldn't stop talking about.`,
        bg: "bg-[var(--color-surface)]",
        align: "items-start text-left",
      },
      {
        kicker: "The Vibe",
        title: report.ai.overallTone,
        body: report.ai.theVibe,
        bg: "bg-[var(--color-accent-soft)]",
        align: "items-center text-center",
      }
    ];
  }, [report]);

  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < slides.length && newIndex !== index) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex(newIndex);
        setIsTransitioning(false);
      }, 300); // 300ms fade duration
    }
  };

  const nextSlide = () => goToSlide(index + 1);
  const prevSlide = () => goToSlide(index - 1);

  // Auto-advance logic (optional, keeping it manual but click areas work like stories)
  
  const active = slides[index];

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-[var(--color-bg-base)] border border-[var(--color-border-strong)] font-sans flex flex-col group">
      
      {/* Progress Bars (Story Style) */}
      <div className="absolute top-0 left-0 w-full p-4 flex gap-2 z-20">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-[var(--color-border-strong)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-text-main)] transition-all duration-300"
              style={{ width: i < index ? "100%" : i === index ? "100%" : "0%" }} // For auto-play, the active one would animate from 0 to 100
            />
          </div>
        ))}
      </div>

      {/* Slide Content Area */}
      <div 
        className={clsx(
          "flex-1 flex flex-col justify-center p-10 relative z-10 transition-opacity duration-300",
          active.bg,
          active.align,
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="w-full flex flex-col gap-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">{active.kicker}</p>
          <h3 className={clsx(
            "font-display leading-none text-[var(--color-text-main)] drop-shadow-sm",
            active.title.length > 20 ? "text-4xl md:text-5xl" : "text-5xl md:text-6xl"
          )}>
            {active.title}
          </h3>
          <p className="text-lg md:text-xl font-medium text-[var(--color-text-muted)] leading-relaxed mt-2">
            {active.body}
          </p>
        </div>
      </div>

      {/* Navigation Overlays (Invisible click areas) */}
      <div 
        className="absolute top-0 left-0 w-1/3 h-full z-10 cursor-w-resize"
        onClick={prevSlide}
        aria-label="Previous Slide"
      />
      <div 
        className="absolute top-0 right-0 w-2/3 h-full z-10 cursor-e-resize"
        onClick={nextSlide}
        aria-label="Next Slide"
      />

      {/* Desktop Navigation Buttons (Visible on hover for clarity) */}
      <div className="absolute bottom-6 left-0 w-full px-6 flex justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={prevSlide}
          disabled={index === 0}
          className="w-10 h-10 rounded-full bg-[var(--color-bg-base)] border border-[var(--color-border-strong)] flex items-center justify-center text-[var(--color-text-main)] disabled:opacity-30 transition-transform hover:scale-110"
        >
          ←
        </button>
        <button 
          onClick={nextSlide}
          disabled={index === slides.length - 1}
          className="w-10 h-10 rounded-full bg-[var(--color-bg-base)] border border-[var(--color-border-strong)] flex items-center justify-center text-[var(--color-text-main)] disabled:opacity-30 transition-transform hover:scale-110"
        >
          →
        </button>
      </div>

    </div>
  );
}

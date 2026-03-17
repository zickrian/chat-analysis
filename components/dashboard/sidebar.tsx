"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const MENU = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "users", label: "Users" },
  { key: "content", label: "Content" },
  { key: "topics", label: "Topics" },
  { key: "wrapped", label: "Wrapped Story" },
];

type Props = {
  reportId: string;
};

export function DashboardSidebar({ reportId }: Props) {
  const pathname = usePathname();

  return (
    <aside className="editorial-card w-full p-6 lg:sticky lg:top-6 lg:w-64 lg:self-start">
      <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-text-soft)] font-mono">Chat Wrapped</p>
      <h2 className="mt-2 text-3xl font-display text-[var(--color-text-main)]">Navigation</h2>

      <nav className="mt-6 space-y-2 font-sans">
        {MENU.map((item) => {
          const href = `/dashboard/${reportId}/${item.key}`;
          const isActive = pathname === href;
          return (
            <Link
              key={item.key}
              href={href}
              className={clsx(
                "block rounded-xl px-4 py-3 text-sm transition-all font-medium",
                isActive 
                  ? "bg-[var(--color-text-main)] text-[var(--color-bg-base)] shadow-md translate-x-1" 
                  : "text-[var(--color-text-soft)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-accent)] hover:translate-x-1"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

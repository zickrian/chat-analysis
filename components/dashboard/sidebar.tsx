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
  { key: "insights", label: "AI Insights" },
  { key: "wrapped", label: "Wrapped Story" },
  { key: "share", label: "Share Report" },
];

type Props = {
  reportId: string;
};

export function DashboardSidebar({ reportId }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-2xl border border-neutral-200 bg-white p-4 lg:sticky lg:top-6 lg:w-60 lg:self-start">
      <p className="text-sm text-neutral-500">Chat Wrapped</p>
      <h2 className="mt-1 text-lg">Navigation</h2>

      <nav className="mt-4 space-y-1">
        {MENU.map((item) => {
          const href = `/dashboard/${reportId}/${item.key}`;
          const isActive = pathname === href;
          return (
            <Link
              key={item.key}
              href={href}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm transition",
                isActive ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100",
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

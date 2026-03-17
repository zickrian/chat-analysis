import { PropsWithChildren } from "react";
import { clsx } from "clsx";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ className, children }: CardProps) {
  return <section className={clsx("rounded-2xl border border-neutral-200 bg-white p-5", className)}>{children}</section>;
}

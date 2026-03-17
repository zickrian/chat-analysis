import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const mondwest = localFont({
  src: "../public/fonts/mondwest-regular.otf",
  variable: "--font-mondwest",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Chat Wrapped AI",
    template: "%s | Chat Wrapped AI",
  },
  description: "Analisis WhatsApp chat kamu secara private dengan insight AI, metrik relasi, dan pencarian berbasis data chat.",
  keywords: [
    "chat wrapped",
    "whatsapp analytics",
    "ai chat insight",
    "relationship intelligence",
    "whatsapp wrapped",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Chat Wrapped AI",
    description: "Ubah export WhatsApp jadi insight AI yang rapi, aman, dan relevan.",
    siteName: "Chat Wrapped AI",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat Wrapped AI",
    description: "Analisis WhatsApp chat kamu dengan AI berbasis data asli.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${mondwest.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

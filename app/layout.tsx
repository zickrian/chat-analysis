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
  title: "Chat Wrapped",
  description: "Discover your WhatsApp Chat Wrapped with private local-first analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${mondwest.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

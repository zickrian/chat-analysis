import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const mondwest = localFont({
  src: "../public/fonts/mondwest-regular.otf",
  variable: "--font-mondwest",
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
    <html lang="en">
      <body className={`${mondwest.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

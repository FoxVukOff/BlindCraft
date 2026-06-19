import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "BlindCraft: Эхо Глубин",
  description: "Текстовый мобильный квест. Ты — слепой рудокоп. Спустись в шахту, используй эхолокацию и найди алмазы.",
  keywords: ["игра", "квест", "blindcraft", "эхолокация", "мобильная игра"],
  authors: [{ name: "BlindCraft" }],
  openGraph: {
    title: "BlindCraft: Эхо Глубин",
    description: "Текстовый мобильный квест о слепом рудокопе.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

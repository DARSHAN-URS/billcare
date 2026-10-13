import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { DemoProvider } from "@/lib/demo-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0f19",
};

export const metadata: Metadata = {
  title: "RUVEXI - The Modern Operating System for Salons & Spas",
  description:
    "End-to-end salon management SaaS platform: Point of Sale (POS) billing, staff commission tracking, salon stock inventory, automated customer follow-ups & branded booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Syne, Outfit, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Pathora — AI-Powered Learning Roadmaps",
  description:
    "Pick a topic, set your goal, and get a personalized step-by-step learning roadmap powered by AI.",
  openGraph: {
    title: "Pathora — AI-Powered Learning Roadmaps",
    description:
      "Pick a topic, set your goal, and get a personalized step-by-step learning roadmap powered by AI.",
    type: "website",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pathora — AI-Powered Learning Roadmaps",
    description:
      "Pick a topic, set your goal, and get a personalized step-by-step learning roadmap powered by AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(syne.variable, outfit.variable, "font-sans", geist.variable, "dark")}>
      <body className="min-h-screen antialiased">{children}</body>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </html>
  );
}

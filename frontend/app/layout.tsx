import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

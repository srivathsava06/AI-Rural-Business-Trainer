import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Rural Business Trainer — Business Trainer for Rural Women Entrepreneurs",
  description:
    "AI-powered business simulation platform where rural women safely practise running a business before investing real money. Guided by AI mentor Lakshmi in Telugu, Hindi, and English.",
  keywords: [
    "AI Rural Business Trainer",
    "rural business",
    "women entrepreneurs",
    "AI mentor",
    "business simulation",
    "Telugu",
    "Hindi",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const vt323 = VT323({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wether Vibe",
  description: "music station based on your mood",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`flex flex-col w-full h-screen ${vt323.className}`}>
        {children}
      </body>
    </html>
  );
}

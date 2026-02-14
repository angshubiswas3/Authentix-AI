import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for professional look
import "./globals.css";

const inter = Inter({
  variable: "--font-inter", // Use existing variable for font
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Authentix AI | Next-Gen Verification",
  description: "Advanced AI-powered content verification platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-[--background]`}>
        {children}
      </body>
    </html>
  );
}

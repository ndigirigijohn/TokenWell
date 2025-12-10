import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TokenWell - Cardano Testnet Token Minting",
  description: "Instantly mint custom test tokens on Cardano Preview and Preprod networks. Perfect for developers.",
  keywords: ["Cardano", "testnet", "tokens", "minting", "blockchain", "crypto", "development"],
  authors: [{ name: "TokenWell" }],
  openGraph: {
    title: "TokenWell - Cardano Testnet Token Minting",
    description: "Instantly mint custom test tokens on Cardano Preview and Preprod networks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

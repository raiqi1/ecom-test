import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce Store - Modern Product Catalog",
  description:
    "Explore our modern e-commerce catalog with product details and search features.",
  keywords: "ecommerce, online store, shopping, products, catalog",
  robots: "index, follow",
  metadataBase: new URL("https://ecom-test-snowy.vercel.app"),
  alternates: {
    canonical: "https://ecom-test-snowy.vercel.app",
  },
  openGraph: {
    title: "E-Commerce Store - Modern Product Catalog",
    description:
      "Explore our modern e-commerce catalog with product details and search features.",
    type: "website",
    url: "https://ecom-test-snowy.vercel.app",
    siteName: "E-Commerce Store",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://ecom-test-snowy.vercel.app" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <Layout>{children}</Layout>
        </CartProvider>
      </body>
    </html>
  );
}

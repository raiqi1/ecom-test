import React from "react";
import { Metadata } from "next";
import { fetchProductById } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Product Not Found - E-Commerce Store",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.title} - E-Commerce Store`,
    description: product.description,
    keywords: `${product.category}, ${product.title}, ecommerce, shopping`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}

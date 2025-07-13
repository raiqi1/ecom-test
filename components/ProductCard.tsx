"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { ToastContainer, useToast } from "@/components/Toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toasts, addToast, removeToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    setIsAddingToCart(true);

    // Simulate a brief loading state
    setTimeout(() => {
      addToCart(product);
      setIsAddingToCart(false);

      // Show toast notification
      addToast(
        `${
          product.title.length > 30
            ? product.title.substring(0, 30) + "..."
            : product.title
        } added to cart!`,
        "success",
        3000
      );
    }, 300);
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <Link href={`/product/${product.id}`} className="flex flex-col h-full">
          <div className="relative aspect-square mb-4 bg-gray-100 rounded-t-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-contain p-4 transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg" />
            )}
          </div>

          <div className="p-4 flex flex-col flex-grow">
            {/* Title with fixed height */}
            <div className="mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors min-h-[3.5rem]">
                {product.title}
              </h3>
            </div>

            {/* Price and Rating - in the middle */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <span className="text-2xl font-bold text-green-600">
                S${product.price.toFixed(2)}
              </span>

              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600">
                  {product.rating.rate.toFixed(1)} ({product.rating.count})
                </span>
              </div>
            </div>

            {/* Buttons always at the bottom */}
            <div className="mt-auto space-y-2">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full py-2 px-4 rounded-md transition-colors duration-200 font-medium ${
                  isAddingToCart
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isAddingToCart ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Adding...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5A1 1 0 006 19h12a1 1 0 001-1v-1M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0V9a1 1 0 011-1h6a1 1 0 011 1v4"
                      />
                    </svg>
                    <span>Add to Cart</span>
                  </div>
                )}
              </button>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
                View Details
              </button>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ProductCard;

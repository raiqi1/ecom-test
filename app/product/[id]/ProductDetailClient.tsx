"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { fetchProductById } from "@/lib/api";
import Loading from "@/components/Loading";
import { useCart } from "@/contexts/CartContext";
import { ToastContainer, useToast } from "@/components/Toast";

interface ProductDetailClientProps {
  productId: string;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  productId,
}) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, cartItems } = useCart();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        setLoading(true);
        try {
          const data = await fetchProductById(productId);
          setProduct(data);
        } catch (error) {
          console.error("Failed to load product:", error);
          addToast("Failed to load product details", "error", 3000);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProduct();
  }, [productId, addToast]);

  const handleBackToCatalog = () => {
    router.push("/");
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Debug log untuk memastikan quantity yang akan dikirim
    console.log("🚀 About to add to cart:", {
      productId: product.id,
      productTitle: product.title,
      quantity: quantity,
      quantityType: typeof quantity,
    });

    setIsAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Debug log sebelum memanggil addToCart
      console.log("📦 Calling addToCart with quantity:", quantity);

      addToCart(product, quantity);

      // Debug log setelah addToCart dipanggil
      console.log("✅ addToCart called successfully");

      addToast(
        `${quantity} ${
          product.title.length > 20
            ? `${product.title.substring(0, 20)}...`
            : product.title
        } added to cart!`,
        "success",
        3000
      );
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      addToast("Failed to add item to cart", "error", 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    setIsAddingToWishlist(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      addToast(
        `${
          product.title.length > 20
            ? `${product.title.substring(0, 20)}...`
            : product.title
        } added to wishlist!`,
        "info",
        3000
      );
    } catch (error) {
      addToast("Failed to add item to wishlist", "error", 3000);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  // Cart status calculations
  const isInCart = product
    ? cartItems.some((item) => item.id === product.id)
    : false;
  const cartQuantity = product
    ? cartItems.find((item) => item.id === product.id)?.quantity || 0
    : 0;

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Product Not Found
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBackToCatalog}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-blue-700 transition-colors active:scale-95"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <button
          onClick={handleBackToCatalog}
          className="mb-4 sm:mb-6 flex items-center text-blue-600 hover:text-blue-700 text-sm sm:text-base transition-colors active:scale-95"
          aria-label="Back to catalog"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Product Image */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-contain p-4 sm:p-8 transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full capitalize mb-2 sm:mb-4">
                {product.category}
              </span>
              <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 break-words">
                {product.title}
              </h1>
            </div>

            {/* Price and Rating */}
            <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-4 space-y-2 xs:space-y-0">
              <span className="text-2xl sm:text-3xl font-bold text-green-600">
                S${product.price.toFixed(2)}
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`text-sm sm:text-base ${
                        index < Math.floor(product.rating.rate)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {product.rating.rate.toFixed(1)} ({product.rating.count}{" "}
                  reviews)
                </span>
              </div>
            </div>

            {/* Cart Status */}
            {isInCart && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-blue-800">
                  <span className="font-semibold">{cartQuantity}</span> item(s)
                  already in cart
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Description
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Features */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Features
              </h2>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span>High-quality materials and construction</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span>Fast and reliable shipping</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span>30-day money-back guarantee</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span>Customer support available 24/7</span>
                </li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Quantity
              </h3>
              <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md w-fit">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-2 sm:px-3 py-1 sm:py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200"
                    aria-label="Decrease quantity"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold text-gray-900 min-w-[2rem] sm:min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= 99}
                    className="px-2 sm:px-3 py-1 sm:py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200"
                    aria-label="Increase quantity"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Total: S${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-colors text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 ${
                  isAddingToCart
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                }`}
                aria-label="Add to cart"
              >
                {isAddingToCart ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5A1 1 0 006 19h12a1 1 0 001-1v-1M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0V9a1 1 0 011-1h6a1 1 0 011 1v4"
                      />
                    </svg>
                    <span>Add {quantity} to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
                className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-colors text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 ${
                  isAddingToWishlist
                    ? "bg-pink-500 text-white cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
                aria-label="Add to wishlist"
              >
                {isAddingToWishlist ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                    <span>Adding to Wishlist...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>Add to Wishlist</span>
                  </>
                )}
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-gray-900">SKU:</span>
                  <span className="text-gray-600 ml-2">
                    #{product.id.toString().padStart(6, "0")}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Category:</span>
                  <span className="text-gray-600 ml-2 capitalize">
                    {product.category}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    Availability:
                  </span>
                  <span className="text-green-600 ml-2">In Stock</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Shipping:</span>
                  <span className="text-gray-600 ml-2">
                    Free shipping on orders over S$50
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            You might also like
          </h2>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Related products feature coming soon...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailClient;

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Product } from "@/types/product";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("📱 Loaded cart from localStorage:", parsedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("❌ Error loading cart from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever cartItems changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log("💾 Saving cart to localStorage:", cartItems);
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    console.log("🛒 addToCart function called with:", {
      productId: product.id,
      productTitle: product.title,
      quantity: quantity,
      quantityType: typeof quantity,
    });

    // Langsung update state tanpa functional update untuk debugging
    setCartItems((prevItems) => {
      console.log("📋 Current cart items:", prevItems);

      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        console.log("🔄 Existing item found at index:", existingItemIndex);
        console.log(
          "🔄 Current quantity:",
          prevItems[existingItemIndex].quantity
        );
        console.log("🔄 Adding quantity:", quantity);

        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };

        console.log("📦 Updated cart items:", newItems);
        return newItems;
      } else {
        console.log("➕ New item, setting quantity to:", quantity);

        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity,
        };

        console.log("🆕 New item created:", newItem);

        const newItems = [...prevItems, newItem];

        console.log("📦 New cart items:", newItems);
        return newItems;
      }
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

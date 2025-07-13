"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Product } from "@/types/product";
import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Banner from "@/components/Banner";
import SearchFilter from "@/components/SearchFilter";
import Loading, { ProductCardSkeleton } from "@/components/Loading";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const productGridWithBanners = useMemo(() => {
    const items: React.ReactElement[] = [];
    let bannerCount = 0;

    filteredProducts.forEach((product, index) => {
      if (index > 0 && index % 12 === 0) {
        items.push(
          <div key={`banner-${bannerCount}`} className="col-span-full">
            <Banner index={bannerCount} />
          </div>
        );
        bannerCount++;
      }

      items.push(<ProductCard key={product.id} product={product} />);
    });

    return items;
  }, [filteredProducts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Catalog
          </h1>
          <p className="text-gray-600">
            Discover amazing products at great prices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Catalog
        </h1>
        <p className="text-gray-600">
          Discover amazing products at great prices
        </p>
      </div>

      <SearchFilter
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          {selectedCategory && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {selectedCategory}
            </span>
          )}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productGridWithBanners}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No products found</div>
          <p className="text-gray-400">
            Try adjusting your search terms or selected category
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

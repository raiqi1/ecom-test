"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

interface SearchFilterProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
  searchQuery: string;
  selectedCategory: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchChange,
  onCategoryChange,
  categories,
  searchQuery,
  selectedCategory,
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [tempSearchQuery, setTempSearchQuery] = useState(searchQuery);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempSearchQuery(e.target.value);
    },
    []
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearchChange(tempSearchQuery);
    },
    [tempSearchQuery, onSearchChange]
  );

  const handleCategorySelect = useCallback(
    (category: string) => {
      onCategoryChange(category);
      setIsCategoryOpen(false);
    },
    [onCategoryChange]
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      {/* Flex container that changes direction based on screen size */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input - Takes full width on mobile, flexible on desktop */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
          >
            Search Products
          </label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              id="search"
              type="text"
              placeholder="Search..."
              value={tempSearchQuery}
              onChange={handleSearchInputChange}
              className="flex-1 min-w-0 px-3 py-2 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Search"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Category Dropdown - Fixed width on desktop, full width on mobile */}
        <div className="w-full md:w-48 relative" ref={categoryRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Category
          </label>
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full px-3 py-2 text-left text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors flex justify-between items-center"
          >
            <span className="truncate capitalize">
              {selectedCategory || "All Categories"}
            </span>
            <span
              className={`transform transition-transform duration-200 ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {isCategoryOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full px-3 py-2 text-left text-sm sm:text-base text-gray-900 hover:bg-blue-50 focus:bg-blue-50 outline-none transition-colors ${
                  !selectedCategory ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full px-3 py-2 text-left text-sm sm:text-base text-gray-900 hover:bg-blue-50 focus:bg-blue-50 capitalize outline-none transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-50 text-blue-700"
                      : ""
                  }`}
                >
                  {category.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCategory) && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs sm:text-sm text-gray-600">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                "{searchQuery}"
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                  aria-label="Remove search"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-800 capitalize">
                {selectedCategory.replace(/-/g, " ")}
                <button
                  onClick={() => onCategoryChange("")}
                  className="ml-1 text-green-600 hover:text-green-800 text-xs sm:text-sm"
                  aria-label="Remove category"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;

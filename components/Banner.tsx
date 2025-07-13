"use client";

import React from "react";

interface BannerProps {
  index: number;
}

const Banner: React.FC<BannerProps> = ({ index }) => {
  const bannerMessages = [
    "🎉 Special Offer - Free Shipping on Orders Over $50!",
    "🛍️ New Arrivals - Check Out Latest Products!",
    "💰 Save 20% on Electronics This Week!",
    "🔥 Limited Time Deal - Buy 2 Get 1 Free!",
    "✨ Premium Quality Products at Best Prices!",
  ];

  const bannerColors = [
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-blue-500 to-teal-500",
    "bg-gradient-to-r from-green-500 to-blue-500",
    "bg-gradient-to-r from-orange-500 to-red-500",
    "bg-gradient-to-r from-indigo-500 to-purple-500",
  ];

  const message = bannerMessages[index % bannerMessages.length];
  const colorClass = bannerColors[index % bannerColors.length];

  return (
    <div
      className={`${colorClass} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 my-8`}
    >
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-2">{message}</h2>
        <p className="text-sm md:text-base opacity-90">
          Don't miss out on our amazing deals!
        </p>
      </div>
    </div>
  );
};

export default Banner;

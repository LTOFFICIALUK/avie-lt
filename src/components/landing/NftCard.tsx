"use client";

import { useState } from "react";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "antd";
import {
  ExportOutlined,
  GlobalOutlined,
  HeartFilled,
  TwitterSquareFilled,
} from "@ant-design/icons";

interface NFTCardProps {
  image: string;
  name: string;
  mcap: string;
  priceChanges: {
    "1h": number;
    "6h": number;
    "12h": number;
    "24h": number;
  };
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  rarityRank?: number;
  creator?: string;
  description?: string;
  twitter?: string;
  website?: string;
}

export function NFTCard({
  image,
  name,
  mcap,
  priceChanges,
  isFavorited = false,
  onToggleFavorite,
  rarityRank = 7965,
  creator = "OpenRarity",
  description = "A unique digital collectible from the LiveStreamCoin collection. This NFT represents the future of streaming.",
  twitter = "https://twitter.com",
  website = "https://example.com",
}: NFTCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      style={{
        border: "none",
        background: "var(--color-gray)",
        padding: 0,
      }}
      styles={{ body: { padding: 0 } }}
      className=" group overflow-hidden cursor-pointer transition-all duration-300"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div>
        {/* Image Container with Slide Animation */}
        <div
          className={cn(
            " transition-all duration-500 ease-in-out transform",
            isExpanded
              ? "translate-x-[-100%] opacity-0"
              : "translate-x-0 opacity-100"
          )}
        >
          <div className="aspect-square rounded-lg overflow-hidden bg-[var(--color-gray)]">
            <Image
              src={image}
              alt={name}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) {
                onToggleFavorite();
              }
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 focus:outline-none"
          >
            {isFavorited ? (
              <HeartFilled className="w-4 h-4 fill-red-500 text-red-500 transition-colors duration-300" />
            ) : (
              <HeartFilled className="w-4 h-4 transition-colors duration-300" />
            )}
          </button>

          {/* Rarity Rank Button */}
          <div className="group/rarity">
            <div className="absolute top-2 left-2 px-2.5 py-1 text-xs sm:text-sm sm:px-3 sm:py-1.5 bg-black/60 text-white rounded hover:bg-black/80 transition-all duration-300 cursor-pointer">
              {rarityRank}
            </div>
            <div className="absolute top-2 left-2 opacity-0 group-hover/rarity:opacity-100 transition-all duration-300">
              <div className="px-2.5 py-2 mt-8 sm:px-3 sm:py-2 sm:mt-9 bg-[var(--color-gray)] border border-[var(--color-gray)] rounded-md text-[10px] sm:text-xs text-gray-300 whitespace-nowrap transition-all duration-300">
                <p>Rarity rank: {rarityRank} / 10,000</p>
                <p className="mt-0.5 sm:mt-1">By {creator}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section with Slide Animation */}
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full bg-[var(--color-gray)] transition-all duration-500 ease-in-out transform",
            isExpanded
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          )}
        >
          <div className="p-3 sm:p-4 h-full flex flex-col">
            {/* Top Actions */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-black/60 text-white rounded transition-all duration-300">
                  Rank #{rarityRank}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 transition-all duration-300">
                  By {creator}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleFavorite) {
                    onToggleFavorite();
                  }
                }}
                className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 focus:outline-none"
              >
                {isFavorited ? (
                  <HeartFilled className="w-3 h-3 sm:w-4 sm:h-4 fill-red-500 text-red-500 transition-all duration-300" />
                ) : (
                  <HeartFilled className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300" />
                )}
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 transition-all duration-300">
                About
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 transition-all duration-300">
                {description}
              </p>

              <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 transition-all duration-300">
                Links
              </h4>
              <div className="flex gap-2 sm:gap-3">
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 sm:p-2 rounded-full bg-[var(--color-gray)] text-white hover:bg-zinc-700 transition-all duration-300"
                >
                  <TwitterSquareFilled
                    className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300"
                    style={{ color: "white" }}
                  />
                </a>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 sm:p-2 rounded-full bg-[var(--color-gray)] text-white hover:bg-zinc-700 transition-all duration-300"
                >
                  <GlobalOutlined
                    style={{ color: "white" }}
                    className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300"
                  />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 sm:p-2 rounded-full bg-[var(--color-gray)] text-white hover:bg-zinc-700 transition-all duration-300"
                >
                  <ExportOutlined
                    className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300"
                    style={{ color: "white" }}
                  />
                </a>
              </div>
            </div>

            <div className="mt-3 sm:mt-4">
              <button
                className="w-full py-1.5 sm:py-2 bg-[var(--color-accent)] text-white text-xs sm:text-sm rounded-lg hover:bg-purple-500 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Always Visible */}
      <div className="bg-[var(--color-gray)]  z-10 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white text-sm sm:text-base transition-all duration-300">
            {name}
          </h3>
          <span className="text-xs sm:text-sm text-gray-400 transition-all duration-300">
            MCAP: {mcap}
          </span>
        </div>

        {/* Price Changes */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-[10px] sm:text-xs transition-all duration-300 mb-2">
          {Object.entries(priceChanges).map(([period, change]) => (
            <div key={period} className="flex flex-col items-center">
              <span className="text-gray-400 transition-all duration-300">
                {period}
              </span>
              <span
                className={cn(
                  change > 0 ? "text-green-500" : "text-red-500",
                  "font-medium transition-all duration-300"
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

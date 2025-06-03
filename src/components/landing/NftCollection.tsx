"use client";

import { useState } from "react";
import { NFTCard } from "./NftCard";

// Mock data matching the image
const MOCK_NFTS = [
  {
    id: 1,
    image: "/images/nft/nft-1.png",
    name: "Meta Streamers",
    mcap: "509.99K",
    rarityRank: 7965,
    creator: "OpenRarity",
    description:
      "A unique collection of Meta Streamers NFTs. Each piece represents a fusion of virtual reality and live streaming.",
    twitter: "https://twitter.com/metastreamers",
    website: "https://metastreamers.io",
    priceChanges: {
      "1h": -0.44,
      "6h": -0.44,
      "12h": -0.44,
      "24h": -0.44,
    },
  },
  {
    id: 2,
    image: "/images/nft/nft-2.png",
    name: "Pixel Legends",
    mcap: "509.99K",
    rarityRank: 8234,
    creator: "OpenRarity",
    description:
      "Pixel Legends brings retro gaming aesthetics to the streaming world. Each NFT is a unique piece of gaming history.",
    twitter: "https://twitter.com/pixellegends",
    website: "https://pixellegends.io",
    priceChanges: {
      "1h": -0.44,
      "6h": -0.44,
      "12h": -0.44,
      "24h": -0.44,
    },
  },
  {
    id: 3,
    image: "/images/nft/nft-3.png",
    name: "Stream Punks",
    mcap: "509.99K",
    rarityRank: 6543,
    creator: "OpenRarity",
    priceChanges: {
      "1h": -0.44,
      "6h": -0.44,
      "12h": -0.44,
      "24h": -0.44,
    },
  },
  {
    id: 4,
    image: "/images/nft/nft-4.png",
    name: "Crypto Streamers",
    mcap: "509.99K",
    rarityRank: 9123,
    creator: "OpenRarity",
    priceChanges: {
      "1h": -0.44,
      "6h": -0.44,
      "12h": -0.44,
      "24h": -0.44,
    },
  },
  {
    id: 5,
    image: "/images/nft/nft-5.png",
    name: "Live Metas",
    mcap: "509.99K",
    rarityRank: 5432,
    creator: "OpenRarity",
    priceChanges: {
      "1h": -0.44,
      "6h": -0.44,
      "12h": -0.44,
      "24h": -0.44,
    },
  },
  {
    id: 6,
    image: "/images/nft/nft-6.png",
    name: "Stream Apes",
    mcap: "509.99K",
    rarityRank: 3456,
    creator: "OpenRarity",
    priceChanges: {
      "1h": +1.23,
      "6h": +0.88,
      "12h": -0.32,
      "24h": +2.45,
    },
  },
  {
    id: 7,
    image: "/images/nft/nft-7.png",
    name: "Digital Nomads",
    mcap: "509.99K",
    rarityRank: 8765,
    creator: "OpenRarity",
    priceChanges: {
      "1h": +0.67,
      "6h": -0.44,
      "12h": +1.56,
      "24h": -0.23,
    },
  },
  {
    id: 8,
    image: "/images/nft/nft-8.png",
    name: "Meta Avatars",
    mcap: "509.99K",
    rarityRank: 2345,
    creator: "OpenRarity",
    priceChanges: {
      "1h": -0.12,
      "6h": +0.78,
      "12h": +1.23,
      "24h": +0.45,
    },
  },
  {
    id: 9,
    image: "/images/nft/nft-9.png",
    name: "Cyber Streamers",
    mcap: "509.99K",
    rarityRank: 4567,
    creator: "OpenRarity",
    priceChanges: {
      "1h": +2.34,
      "6h": +1.67,
      "12h": +0.89,
      "24h": +3.45,
    },
  },
  {
    id: 10,
    image: "/images/nft/nft-10.png",
    name: "Stream Worlds",
    mcap: "509.99K",
    rarityRank: 7654,
    creator: "OpenRarity",
    priceChanges: {
      "1h": -0.78,
      "6h": -0.34,
      "12h": +0.56,
      "24h": -0.12,
    },
  },
];

export function NFTCollection() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((fid) => fid !== id)
        : [...current, id]
    );
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-3 md:px-4 transition-all duration-300">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-6 transition-all duration-300">
        {MOCK_NFTS.map((nft) => (
          <div
            key={nft.id}
            className="transition-all duration-300 transform hover:scale-[1.02]"
          >
            <NFTCard
              image={nft.image}
              name={nft.name}
              mcap={nft.mcap}
              priceChanges={nft.priceChanges}
              isFavorited={favorites.includes(nft.id)}
              onToggleFavorite={() => toggleFavorite(nft.id)}
              rarityRank={nft.rarityRank}
              creator={nft.creator}
              description={nft.description}
              twitter={nft.twitter}
              website={nft.website}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

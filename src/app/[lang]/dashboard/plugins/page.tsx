"use client";
import { Plugin } from "@/types/plugins";
import React from "react";
import PluginCard from "./(components)/PluginCard";
import { FiZap, FiStar } from "react-icons/fi";

const Page = () => {
  const plugins: Plugin[] = [
    {
      id: "stream",
      title: "Stream",
      description:
        "Get your stream key to start broadcasting live on our platform. Connect with OBS, Streamlabs, or any RTMP-compatible streaming software.",
      settingsUrl: "plugins/stream",
      price: "$0.00",
      isActive: false,
      isLoading: true,
      isRedeploying: false,
    },
    {
      id: "character",
      title: "Character Generator",
      description: "Generate your own character based on your description using advanced AI technology",
      price: "$4.99",
      settingsUrl: "plugins/characters",
      isActive: false,
      isLoading: false,
      comingSoon: true,
    },
    {
      id: "multistream",
      title: "MultiStream",
      description:
        "Configure multiple streaming destinations for your live stream. Reach audiences across all major platforms simultaneously.",
      price: "$9.99",
      settingsUrl: "plugins/multistream",
      isActive: false,
      isLoading: false,
    },
  ];

  const featuredPlugins = plugins.filter(plugin => plugin.id === "stream" || plugin.id === "multistream");

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 pt-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6">
            <FiZap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Supercharge Your Stream
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover powerful plugins to enhance your streaming experience. From AI-powered tools to multi-platform broadcasting.
          </p>
        </div>

        {/* Featured Plugins Section */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <FiStar className="w-6 h-6 text-cyan-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">Featured Plugins</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featuredPlugins.map((plugin) => (
              <div key={plugin.id} className="relative">
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  Featured
                </div>
                <PluginCard
                  href={plugin.settingsUrl}
                  title={plugin.title}
                  description={plugin.description}
                  price={plugin.price}
                />
              </div>
            ))}
          </div>
        </div>

        {/* All Plugins Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">All Plugins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plugins.map((plugin) => (
              <div key={plugin.id} className="relative">
                {plugin.comingSoon && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold z-10">
                    Coming Soon
                  </div>
                )}
                <div className={plugin.comingSoon ? "opacity-60 pointer-events-none cursor-not-allowed" : ""}>
                  <PluginCard
                    href={plugin.comingSoon ? "#" : plugin.settingsUrl}
                    title={plugin.title}
                    description={plugin.description}
                    price={plugin.price}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Plugins</h1>
        <p className="text-base sm:text-lg text-gray-400 mb-3 sm:mb-4">Discover powerful plugins to enhance your streaming experience.</p>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
      </div>
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-4 sm:mb-6">
            <FiZap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
            Supercharge Your Stream
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            Discover powerful plugins to enhance your streaming experience. From AI-powered tools to multi-platform broadcasting.
          </p>
        </div>

        {/* Featured Plugins Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center mb-4 sm:mb-6">
            <FiStar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mr-2 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Featured Plugins</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 items-stretch">
            {featuredPlugins.map((plugin) => (
              <div key={plugin.id} className="relative">
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold z-10">
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
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">All Plugins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {plugins.map((plugin) => (
              <div key={plugin.id} className="relative">
                {plugin.comingSoon && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold z-10">
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
  );
};

export default Page;

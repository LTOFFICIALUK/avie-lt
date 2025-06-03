"use client";
import { Plugin } from "@/types/plugins";
import React, { useState } from "react";
import PluginCard from "./(components)/PluginCard";
import { FiSearch, FiZap, FiVideo, FiUsers, FiStar, FiFilter } from "react-icons/fi";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const categories = [
    { id: "all", name: "All Plugins", icon: FiFilter },
    { id: "streaming", name: "Streaming", icon: FiVideo },
    { id: "ai", name: "AI Tools", icon: FiZap },
    { id: "social", name: "Social", icon: FiUsers },
  ];

  const featuredPlugins = plugins.filter(plugin => plugin.id === "stream" || plugin.id === "character");
  
  const filteredPlugins = plugins.filter(plugin => 
    plugin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

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
          
          {/* Search and Filter Bar */}
          <div className="max-w-md mx-auto relative mb-8">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-cyan-500 text-white shadow-lg"
                      : "bg-[#1A1A1A] text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
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
            {filteredPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                href={plugin.settingsUrl}
                title={plugin.title}
                description={plugin.description}
                price={plugin.price}
              />
            ))}
          </div>
          
          {filteredPlugins.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No plugins found</div>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

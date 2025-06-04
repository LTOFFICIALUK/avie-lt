import React from "react";
import FeaturedStreams from "@/components/lang-page/FeaturedStreams";

const PlaylistsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Playlists</h1>
          <p className="text-gray-400">
            Discover curated collections of the best crypto and trading content
          </p>
        </div>

        {/* Featured Streams Section */}
        <FeaturedStreams className="mb-12" />

        {/* Additional sections can be added here */}
      </div>
    </div>
  );
};

export default PlaylistsPage;

import React from "react";

const page = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb">
      <h1 className="text-3xl font-bold text-white mb-1">Trending</h1>
        <p className="text-lg text-gray-400 mb-2">See what's trending on the platform.</p>
      </div>
      
      {/* Content will go here */}
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔥</div>
        <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
        <p className="text-gray-400">
          Trending content will be available here soon
        </p>
      </div>
    </div>
  );
};

export default page;

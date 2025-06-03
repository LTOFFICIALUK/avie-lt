import React from "react";
import { CreateCharacterForm } from "../(components)/CreateCharacterForm";
import { FiUserPlus, FiZap } from "react-icons/fi";

const page = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 pt-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6">
            <FiUserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Create AI Character
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Design a unique AI-powered character for your streams. Customize personality, appearance, and interactive behaviors to enhance viewer engagement.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <CreateCharacterForm />
        </div>
      </div>
    </div>
  );
};

export default page;

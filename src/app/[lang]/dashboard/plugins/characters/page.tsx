"use client";
import api from "@/lib/api";
import React, { useCallback, useEffect, useState } from "react";
import { CharacterList } from "./(components)/CharacterList";
import { CharacterFormData } from "@/types/character";
import { ApiErrorResponse } from "@/types/api";
import { FiUser, FiZap } from "react-icons/fi";

const Page = () => {
  const [characters, setCharacters] = useState<CharacterFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/character/my");
      if (response.data) {
        setCharacters(response.data);
        setError(null);
      }
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      console.error("Error fetching characters:", err);
      setError(apiError.response?.data?.error || "Failed to load characters");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <div className="container mx-auto px-4 pt-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <div className="container mx-auto px-4 pt-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 pt-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Character Generator
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Create unique AI-powered characters for your streams. Generate avatars, personalities, and interactive elements that enhance viewer engagement.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <CharacterList characters={characters} onRefresh={fetchCharacters} />
        </div>
      </div>
    </div>
  );
};

export default Page;

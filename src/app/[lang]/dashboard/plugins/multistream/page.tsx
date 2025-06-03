"use client";

import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { api } from "@/lib/api";
import { FiVideo, FiMonitor } from "react-icons/fi";

import { AddRestreamForm } from "./(components)/AddRestreamForm";
import { RestreamList } from "./(components)/RestreamList";

interface RestreamDestination {
  id: string;
  name: string;
  rtmpUrl: string;
  streamKey: string;
}

const RestreamPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<RestreamDestination[]>([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/api/stream/restreams');
      setDestinations(response.data.data);
    } catch (err) {
      console.error('Error fetching restream destinations:', err);
      setError('Failed to load restream destinations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDestination = async (newDestination: Omit<RestreamDestination, 'id'>) => {
    setError(null);

    try {
      const response = await api.post('/api/stream/restreams', newDestination);
      setDestinations([...destinations, response.data.data]);
      return true;
    } catch (err) {
      console.error('Error adding restream destination:', err);
      setError('Failed to add restream destination');
      return false;
    }
  };

  const handleDeleteDestination = async (id: string) => {
    try {
      await api.delete(`/api/stream/restreams/${id}`);
      setDestinations(destinations.filter(d => d.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting multistream destination:', err);
      setError('Failed to delete multistream destination');
      return false;
    }
  };

  // Loading state
  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 pt-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6">
            <FiMonitor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            MultiStream
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Configure multiple streaming destinations for your live stream. Reach audiences across all major platforms simultaneously.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Add New Destination */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Add New Destination</h2>
              <p className="text-gray-400">
                Configure a new streaming destination for your content.
              </p>
            </div>
            
            <AddRestreamForm 
              onAddDestination={handleAddDestination}
              error={error}
              setError={setError}
            />
          </div>

          {/* Existing Destinations */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Multistream Destinations</h2>
              <p className="text-gray-400">
                Manage your existing streaming destinations.
              </p>
            </div>
            
            <RestreamList 
              destinations={destinations}
              onDeleteDestination={handleDeleteDestination}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestreamPage; 
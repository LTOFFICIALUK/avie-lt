"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Input, 
  Button, 
  Typography,
  Alert,
  Spin,
  Checkbox
} from "antd";
import {
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { api } from "@/lib/api";
import { CategorySelector } from "./(components)";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiVideo, FiKey } from "react-icons/fi";

const { Text, Title } = Typography;

// Helper function for class names
const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface StreamSettings {
  displayName: string;
  streamKey: string;
  rtmpUrl: string;
  playbackUrl: string;
}

const StreamPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [settings, setSettings] = useState<StreamSettings | null>(null);
  const [isStreamConnected, setIsStreamConnected] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isStartingStream, setIsStartingStream] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [streamTitle, setStreamTitle] = useState('');
  const [is18Plus, setIs18Plus] = useState(false);
  const { lang } = useParams();

  // Check stream status periodically
  const checkStreamStatus = useCallback(async () => {
    if (!settings?.displayName) {
      console.log('No display name available, skipping status check');
      return;
    }
    
    try {
      const streamingResponse = await fetch(`https://streamapi.avie.live/api/stream/${settings.displayName}/status`);
      const streamingData = await streamingResponse.json();
      
      setIsStreamConnected(streamingData.isLive);
      
      if (streamingData.isLive) {
        const backendResponse = await api.get(`/api/stream/${settings.displayName}`);
        const isStreamLive = backendResponse.data.data.isLive;
        setIsLive(isStreamLive);
      } else {
        setIsLive(false);
      }
    } catch (err) {
      console.error('Stream status check error:', err);
      setIsStreamConnected(false);
      setIsLive(false);
    }
  }, [settings?.displayName]);

  // Initial data loading
  useEffect(() => {
    fetchStreamKey();
  }, []);

  // Set up stream status polling
  useEffect(() => {
    if (settings?.displayName) {
      const interval = setInterval(checkStreamStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [settings?.displayName, checkStreamStatus]);

  // Fetch stream key and settings
  const fetchStreamKey = async () => {
    try {
      const response = await api.get('/api/stream/key/get');
      
      const streamData = response.data.data;
      
      setSettings({
        displayName: streamData.displayName,
        streamKey: streamData.streamKey,
        rtmpUrl: streamData.rtmpUrl,
        playbackUrl: streamData.playbackUrl
      });
    } catch (err) {
      console.error('Error fetching stream key:', err);
      setError('Failed to load stream settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Start stream
  const startStream = async () => {
    if (!selectedCategory) {
      setError('A category is required');
      return;
    }

    if (!streamTitle.trim()) {
      setError('Stream title is required');
      return;
    }
    
    setIsStartingStream(true);
    setError(null);
    
    try {
      await api.post('/api/stream/start', { 
        categoryId: selectedCategory,
        title: streamTitle,
        is18Plus
      });
      setIsLive(true);
    } catch (err) {
      console.error('Error starting stream:', err);
      setError('Failed to start stream');
    } finally {
      setIsStartingStream(false);
    }
  };

  // End stream
  const endStream = async () => {
    try {
      await api.post('/api/stream/end');
      setIsLive(false);
    } catch (err) {
      console.error('Error ending stream:', err);
      setError('Failed to end stream');
    }
  };

  // Generate new stream key
  const generateNewKey = async () => {
    if (!confirm('Are you sure you want to generate a new stream key? This will invalidate your current key.')) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await api.post('/api/stream/key/generate');
      setSettings(response.data.data);
    } catch (err) {
      console.error('Error generating stream key:', err);
      setError('Failed to generate new stream key');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get appropriate button text
  const getStreamButtonText = () => {
    if (isStartingStream) return 'Starting Stream...';
    if (isLive) return 'End Stream';
    if (!isStreamConnected) return 'Waiting for Connection...';
    if (!streamTitle.trim()) return 'Enter Stream Title';
    if (!selectedCategory) return 'Select a Category';
    return 'Start Stream';
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
            <FiVideo className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Go Live
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Get your stream key to start broadcasting live on our platform. Connect with OBS, Streamlabs, or any RTMP-compatible streaming software.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
          {/* Stream Key Card */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FiKey className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Stream Key</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Enter these credentials into your streaming software to connect your broadcast securely.
            </p>
            
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-300">Stream URL</label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={settings?.rtmpUrl || ''}
                      className="bg-[#2A2A2A] border-gray-700 text-white font-mono"
                    />
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(settings?.rtmpUrl || '')}
                      className="text-gray-400 hover:text-cyan-400 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-300">Stream Key</label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={settings?.streamKey || ''}
                      type={showKey ? "text" : "password"}
                      className="bg-[#2A2A2A] border-gray-700 text-white font-mono"
                    />
                    <Button
                      type="text"
                      icon={showKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={() => setShowKey(!showKey)}
                      className="text-gray-400 hover:text-cyan-400 border-gray-700"
                    />
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(settings?.streamKey || '')}
                      className="text-gray-400 hover:text-cyan-400 border-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-700">
                <Button
                  onClick={generateNewKey}
                  disabled={isGenerating}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  {isGenerating ? (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: '16px', marginRight: '8px' }} spin />} />
                  ) : (
                    <ReloadOutlined style={{ marginRight: '8px' }} />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate New Key'}
                </Button>
              </div>
            </div>
          </div>

          {/* Stream Settings Card */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Stream Details</h2>
              <p className="text-gray-400">
                Configure your stream details before going live.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-300">Stream Title</label>
                  <Input
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    placeholder="Enter your stream title"
                    className="bg-[#2A2A2A] border-gray-700 text-white"
                  />
                </div>

                {/* Use the CategorySelector component */}
                <CategorySelector 
                  selectedCategory={selectedCategory} 
                  onCategoryChange={setSelectedCategory}
                />

                <div className="space-y-2.5">
                  <Checkbox 
                    checked={is18Plus}
                    onChange={(e) => setIs18Plus(e.target.checked)}
                    className="text-gray-300"
                  >
                    <span className="text-sm font-medium text-gray-300">Mark As 18+ Content</span>
                  </Checkbox>
                  <div className="text-xs ml-6 text-gray-400">
                    Select this option if your stream includes mature or adult-oriented content. Viewers who have disabled 18+ content will not see your stream.
                  </div>
                </div>
              </div>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                  className="bg-red-500/10 border-red-500/20"
                />
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                {/* Stats Button - Only show when live */}
                {isLive && settings?.displayName && (
                  <Link href={`/${lang}/streams/${settings.displayName}/stats`}>
                    <Button
                      type="primary"
                      icon={<BarChartOutlined />}
                      className="bg-cyan-500 hover:bg-cyan-600 border-cyan-500 text-white"
                    >
                      Stream Stats
                    </Button>
                  </Link>
                )}
                
                <Button
                  type={isLive ? "primary" : "default"}
                  danger={isLive}
                  onClick={isLive ? endStream : startStream}
                  disabled={!isStreamConnected || isStartingStream || (!isLive && (!streamTitle.trim() || !selectedCategory))}
                  className={classNames(
                    isLive 
                      ? "bg-red-600 hover:bg-red-700 border-red-600" 
                      : "bg-cyan-500 hover:bg-cyan-600 border-cyan-500 text-white",
                    (!isStreamConnected || isStartingStream) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isStartingStream && (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: '16px', marginRight: '8px' }} spin />} />
                  )}
                  {getStreamButtonText()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPage;

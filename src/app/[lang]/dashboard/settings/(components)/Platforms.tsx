"use client";

import React, { useEffect, useState } from "react";
import { Button, Spin, message } from "antd";
import { api } from "@/lib/api";
import {
  DiscordOutlined,
  TwitchOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { FaKickstarter } from "react-icons/fa";

// Tip za povezavo platforme
interface PlatformConnection {
  id: string;
  platform: "DISCORD" | "TWITCH" | "KICK";
  username: string;
  isActive: boolean;
  isVerified: boolean;
}

const Platforms = () => {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
  }, []);

  // Pridobi vse povezave platform za trenutnega uporabnika
  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/platforms/connections");
      setConnections(response.data.connections || []);
    } catch (error) {
      console.error("Error fetching platform connections:", error);
      message.error("Failed to load platform connections");
    } finally {
      setLoading(false);
    }
  };

  // Funkcija za pridobitev URL-ja za avtentikacijo s platformo
  const connectToPlatform = async (platform: string) => {
    try {
      let response;
      
      switch (platform.toLowerCase()) {
        case "discord":
          response = await api.get("/api/platforms/discord/auth-url");
          break;
        case "twitch":
          response = await api.get("/api/platforms/twitch/auth-url");
          break;
        case "kick":
          response = await api.get("/api/platforms/kick/auth-url");
          // Shranimo code verifier za PKCE v local storage
          if (response.data.codeVerifier) {
            localStorage.setItem("kickCodeVerifier", response.data.codeVerifier);
            localStorage.setItem("kickState", response.data.state);
          }
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      // Preusmerimo uporabnika na URL za prijavo
      if (response?.data?.authUrl) {
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      message.error(`Failed to connect to ${platform}`);
    }
  };

  // Funkcija za prekinitev povezave s platformo
  const disconnectPlatform = async (connectionId: string, platform: string) => {
    try {
      setDisconnecting(connectionId);
      
      switch (platform) {
        case "DISCORD":
          await api.delete("/api/platforms/discord/disconnect");
          break;
        case "TWITCH":
          await api.delete("/api/platforms/twitch/disconnect");
          break;
        case "KICK":
          await api.delete("/api/platforms/kick/disconnect");
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      
      // Osveži seznam povezav
      await fetchConnections();
      message.success(`Disconnected from ${platform.toLowerCase()}`);
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      message.error(`Failed to disconnect from ${platform.toLowerCase()}`);
    } finally {
      setDisconnecting(null);
    }
  };

  // Preveri, če je določena platforma že povezana
  const isPlatformConnected = (platform: string) => {
    return connections.some(conn => conn.platform === platform && conn.isActive);
  };

  // Vrni ikono za platformo
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "DISCORD":
        return <DiscordOutlined className="mr-2" />;
      case "TWITCH":
        return <TwitchOutlined className="mr-2" />;
      case "KICK":
        return <FaKickstarter className="mr-2" />;
      default:
        return null;
    }
  };

  // Vrni barvo za platformo
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "DISCORD":
        return "#5865F2";
      case "TWITCH":
        return "#9146FF";
      case "KICK":
        return "#53FC18";
      default:
        return "#333";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Platform Connections</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Discord */}
        <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-md">
          <div className="flex items-center">
            <DiscordOutlined className="text-[#5865F2] mr-3 text-xl" />
            <div>
              <p className="font-medium">Discord</p>
              {isPlatformConnected("DISCORD") ? (
                <p className="text-xs text-gray-400">
                  Connected as {connections.find(c => c.platform === "DISCORD")?.username}
                </p>
              ) : (
                <p className="text-xs text-gray-400">Not connected</p>
              )}
            </div>
          </div>
          
          {isPlatformConnected("DISCORD") ? (
            <Button 
              danger
              type="text"
              icon={disconnecting === connections.find(c => c.platform === "DISCORD")?.id ? <LoadingOutlined /> : <CloseOutlined />}
              onClick={() => {
                const connection = connections.find(c => c.platform === "DISCORD");
                if (connection) {
                  disconnectPlatform(connection.id, "DISCORD");
                }
              }}
              disabled={!!disconnecting}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              type="primary"
              style={{ backgroundColor: "#5865F2" }}
              onClick={() => connectToPlatform("discord")}
              disabled={!!disconnecting}
            >
              Connect
            </Button>
          )}
        </div>
        
        {/* Twitch */}
        <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-md">
          <div className="flex items-center">
            <TwitchOutlined className="text-[#9146FF] mr-3 text-xl" />
            <div>
              <p className="font-medium">Twitch</p>
              {isPlatformConnected("TWITCH") ? (
                <p className="text-xs text-gray-400">
                  Connected as {connections.find(c => c.platform === "TWITCH")?.username}
                </p>
              ) : (
                <p className="text-xs text-gray-400">Not connected</p>
              )}
            </div>
          </div>
          
          {isPlatformConnected("TWITCH") ? (
            <Button 
              danger
              type="text"
              icon={disconnecting === connections.find(c => c.platform === "TWITCH")?.id ? <LoadingOutlined /> : <CloseOutlined />}
              onClick={() => {
                const connection = connections.find(c => c.platform === "TWITCH");
                if (connection) {
                  disconnectPlatform(connection.id, "TWITCH");
                }
              }}
              disabled={!!disconnecting}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              type="primary"
              style={{ backgroundColor: "#9146FF" }}
              onClick={() => connectToPlatform("twitch")}
              disabled={!!disconnecting}
            >
              Connect
            </Button>
          )}
        </div>
        
        {/* Kick */}
        <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-md">
          <div className="flex items-center">
            <FaKickstarter className="text-[#53FC18] mr-3 text-xl" />
            <div>
              <p className="font-medium">Kick</p>
              {isPlatformConnected("KICK") ? (
                <p className="text-xs text-gray-400">
                  Connected as {connections.find(c => c.platform === "KICK")?.username}
                </p>
              ) : (
                <p className="text-xs text-gray-400">Not connected</p>
              )}
            </div>
          </div>
          
          {isPlatformConnected("KICK") ? (
            <Button 
              danger
              type="text"
              icon={disconnecting === connections.find(c => c.platform === "KICK")?.id ? <LoadingOutlined /> : <CloseOutlined />}
              onClick={() => {
                const connection = connections.find(c => c.platform === "KICK");
                if (connection) {
                  disconnectPlatform(connection.id, "KICK");
                }
              }}
              disabled={!!disconnecting}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              type="primary"
              style={{ backgroundColor: "#53FC18", color: "#000" }}
              onClick={() => connectToPlatform("kick")}
              disabled={!!disconnecting}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mt-4">
        <p>Connect your accounts to access additional features like chat integration and stream management.</p>
      </div>
    </div>
  );
};

export default Platforms; 
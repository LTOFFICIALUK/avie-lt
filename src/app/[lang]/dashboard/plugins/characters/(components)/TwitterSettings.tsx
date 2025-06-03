import { Switch } from "antd";
import { Button } from "antd";
import {
  TwitterOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useState, useCallback, useEffect } from "react";
import baseApi from "@/lib/api";

interface TwitterSettingsProps {
  characterId?: string;
  postWithImages: boolean;
  setPostWithImages: (value: boolean) => void;
}

export function TwitterSettings({
  characterId,
  postWithImages,
  setPostWithImages,
}: TwitterSettingsProps) {
  const [isConnectingV2, setIsConnectingV2] = useState(false);
  const [isConnectingV1, setIsConnectingV1] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnectedV1, setIsConnectedV1] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthWindow, setOauthWindow] = useState<Window | null>(null);
  const [platformUsername, setPlatformUsername] = useState<string>("");
  const [platformUsernameV1, setPlatformUsernameV1] = useState<string>("");

  // Fetch social connections
  useEffect(() => {
    const fetchSocials = async () => {
      if (!characterId) return;

      try {
        const response = await baseApi.get(
          `/api/character/${characterId}/socials`
        );
        console.log("Twitter social data:", response.data);

        // Check OAuth 2 connection
        if (response.data && response.data.twitter) {
          const { twitter } = response.data;

          if (twitter && twitter.connected) {
            setIsConnected(true);
            setPlatformUsername(twitter.platformUsername || "");
            console.log("Twitter OAuth 2 connected:", twitter.platformUsername);
          } else {
            setIsConnected(false);
            console.log("Twitter OAuth 2 not connected");
          }
        } else {
          setIsConnected(false);
          console.log("No Twitter OAuth 2 data found");
        }

        // Check OAuth 1 connection
        if (response.data && response.data.twitter_v1) {
          const { twitter_v1 } = response.data;

          if (twitter_v1 && twitter_v1.connected) {
            setIsConnectedV1(true);
            setPlatformUsernameV1(twitter_v1.platformUsername || "");
            console.log(
              "Twitter OAuth 1 connected:",
              twitter_v1.platformUsername
            );
          } else {
            setIsConnectedV1(false);
            console.log("Twitter OAuth 1 not connected");
          }
        } else {
          setIsConnectedV1(false);
          console.log("No Twitter OAuth 1 data found");
        }
      } catch (err) {
        console.error("Error fetching social connections:", err);
        setIsConnected(false);
        setIsConnectedV1(false);
      }
    };

    fetchSocials();
  }, [characterId]);

  const handleOAuthCallback = useCallback(
    (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "TWITTER_OAUTH_SUCCESS") {
        const { username, platform } = event.data;

        if (platform === "twitter_v1") {
          setPlatformUsernameV1(username || "");
          setIsConnectedV1(true);
          setIsConnectingV1(false);
        } else {
          setPlatformUsername(username || "");
          setIsConnected(true);
          setIsConnectingV2(false);
        }

        oauthWindow?.close();
        window.removeEventListener("message", handleOAuthCallback);
      } else if (event.data.type === "TWITTER_OAUTH_ERROR") {
        setError(event.data.error || "Failed to connect to Twitter");
        oauthWindow?.close();
        window.removeEventListener("message", handleOAuthCallback);
        setIsConnectingV1(false);
        setIsConnectingV2(false);
      }
    },
    [oauthWindow]
  );

  const handleOAuthConnect = async (version = "v2") => {
    if (!characterId) {
      setError("Character must be saved before connecting Twitter");
      return;
    }

    try {
      // Set the appropriate loading state
      if (version === "v1") {
        setIsConnectingV1(true);
      } else {
        setIsConnectingV2(true);
      }

      setError(null);

      // Request OAuth URL from backend using the correct endpoint
      const endpoint =
        version === "v1"
          ? `/api/character/${characterId}/oauth/twitter/v1`
          : `/api/character/${characterId}/oauth/twitter`;

      const response = await baseApi.get(endpoint);
      const { url } = response.data;

      // Open OAuth window
      const newOauthWindow = window.open(
        url,
        "Twitter OAuth",
        "width=600,height=800"
      );
      setOauthWindow(newOauthWindow);

      // Set up message listener for OAuth callback
      window.addEventListener("message", handleOAuthCallback, false);
    } catch (err) {
      console.error("Error initiating OAuth flow:", err);
      setError(
        `Failed to start Twitter ${
          version === "v1" ? "API v1" : ""
        } connection process`
      );

      // Reset loading state on error
      if (version === "v1") {
        setIsConnectingV1(false);
      } else {
        setIsConnectingV2(false);
      }
    }
  };

  const handleDisconnect = async (platform = "twitter") => {
    if (!characterId) return;

    try {
      // Set the appropriate loading state
      if (platform === "twitter_v1") {
        setIsConnectingV1(true);
      } else {
        setIsConnectingV2(true);
      }

      setError(null);

      // Call the disconnect endpoint
      await baseApi.delete(`/api/character/${characterId}/socials/${platform}`);

      // Clear local state
      if (platform === "twitter_v1") {
        setPlatformUsernameV1("");
        setIsConnectedV1(false);
      } else {
        setPlatformUsername("");
        setIsConnected(false);
      }
    } catch (err) {
      console.error(`Error disconnecting ${platform}:`, err);
      setError(
        `Failed to disconnect ${
          platform === "twitter_v1" ? "Twitter API v1" : "Twitter"
        } account`
      );
    } finally {
      // Reset loading state
      if (platform === "twitter_v1") {
        setIsConnectingV1(false);
      } else {
        setIsConnectingV2(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TwitterOutlined style={{ color: "#1DA1F2", fontSize: 18 }} />
          <h3>Twitter Settings</h3>
        </div>
      </div>

      {/* OAuth 2 Connect Button */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={
            isConnected
              ? () => handleDisconnect("twitter")
              : () => handleOAuthConnect("v2")
          }
          danger={isConnected}
          type={isConnected ? "primary" : "default"}
          className="w-full flex items-center gap-2"
          disabled={isConnectingV2 || !characterId}
          icon={isConnectingV2 ? <LoadingOutlined /> : <TwitterOutlined />}
        >
          {isConnectingV2
            ? "Processing..."
            : isConnected
            ? "Disconnect Twitter (OAuth 2)"
            : "Connect with Twitter (OAuth 2)"}
        </Button>

        {isConnected && (
          <div className="p-2 bg-green-500/20 border border-green-500/30 rounded-md">
            <p className="text-xs text-green-300">
              OAuth 2: Connected as{" "}
              {platformUsername ? `@${platformUsername}` : "Twitter account"}
            </p>
          </div>
        )}
      </div>

      {/* OAuth 1 Connect Button */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={
            isConnectedV1
              ? () => handleDisconnect("twitter_v1")
              : () => handleOAuthConnect("v1")
          }
          danger={isConnectedV1}
          type={isConnectedV1 ? "primary" : "default"}
          className="w-full flex items-center gap-2"
          disabled={isConnectingV1 || !characterId}
          icon={isConnectingV1 ? <LoadingOutlined /> : <TwitterOutlined />}
        >
          {isConnectingV1
            ? "Processing..."
            : isConnectedV1
            ? "Disconnect Twitter API v1"
            : "Connect with Twitter API v1"}
        </Button>

        {isConnectedV1 && (
          <div className="p-2 bg-green-500/20 border border-green-500/30 rounded-md">
            <p className="text-xs text-green-300">
              API v1: Connected as{" "}
              {platformUsernameV1
                ? `@${platformUsernameV1}`
                : "Twitter account"}
            </p>
          </div>
        )}
      </div>

      {!characterId && (
        <p className="text-xs text-amber-400">
          Save the character first to enable Twitter connection
        </p>
      )}

      {error && (
        <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-md">
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      <p className="text-xs text-[var(--text-secondary)]">
        Connect your Twitter account to allow the character to post on your
        behalf. The API v1 connection provides additional features like media
        upload.
      </p>

      {/* Post with Images */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">Post with Images</p>
        <Switch checked={postWithImages} onChange={setPostWithImages} />
      </div>
    </div>
  );
}

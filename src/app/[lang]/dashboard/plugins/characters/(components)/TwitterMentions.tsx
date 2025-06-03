import { useState, useEffect } from "react";
import { Input, Button, Card, Alert } from "antd";
import {
  CloseOutlined,
  EditOutlined,
  InfoCircleOutlined,
  TwitterOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { EditingIndex } from "@/lib/character";
import baseApi from "@/lib/api";

// Define the Twitter mention interface with ID
interface TwitterMention {
  username: string;
  id?: string;
}

interface TwitterMentionsProps {
  twitterMentions: string[] | TwitterMention[];
  setTwitterMentions: (mentions: TwitterMention[]) => void;
  characterId?: string;
}

export function TwitterMentions({
  twitterMentions,
  setTwitterMentions,
  characterId,
}: TwitterMentionsProps) {
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<EditingIndex>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert string[] to TwitterMention[] if needed
  const [mentions, setMentions] = useState<TwitterMention[]>([]);

  // Convert any string mentions to TwitterMention objects when component mounts
  useEffect(() => {
    if (twitterMentions && twitterMentions.length > 0) {
      const convertedMentions = twitterMentions.map((mention) => {
        if (typeof mention === "string") {
          return { username: mention };
        }
        return mention as TwitterMention;
      });
      setMentions(convertedMentions);
    } else {
      setMentions([]);
    }
  }, [twitterMentions]);

  // Validate that the input is a valid Twitter handle
  const isValidUsername = (username: string) => {
    // Twitter usernames can only contain alphanumeric characters and underscores
    // and must be between 1 and 15 characters long
    const usernameRegex = /^[a-zA-Z0-9_]{1,15}$/;
    return usernameRegex.test(username);
  };

  // Look up Twitter username via API
  const lookupTwitterUser = async (
    username: string
  ): Promise<TwitterMention | null> => {
    if (!characterId) {
      // If no characterId, just return the username without ID
      return { username };
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await baseApi.get(
        `/api/twitter/character/${characterId}/user/${username}`
      );

      if (response.data && response.data.data) {
        return {
          username,
          id: response.data.data.id,
        };
      } else {
        setError("User found but data is in unexpected format");
        return { username };
      }
    } catch (err) {
      console.error("Error looking up Twitter user:", err);
      setError("Unable to find Twitter user. The username may not exist.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMention = async () => {
    // Remove @ symbol if user included it
    const cleanUsername = inputValue.trim().replace(/^@/, "");

    if (!cleanUsername) return;

    if (!isValidUsername(cleanUsername)) {
      setError(
        "Please enter a valid Twitter username (alphanumeric and underscore characters only, max 15 characters)"
      );
      return;
    }

    // Check if the username already exists in the mentions
    const existingMention = mentions.find(
      (mention) =>
        mention.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (existingMention) {
      setError("This username is already in your mentions list");
      return;
    }

    try {
      // Look up the user on Twitter
      const twitterUser = await lookupTwitterUser(cleanUsername);

      if (!twitterUser) {
        return; // Error is already set by lookupTwitterUser
      }

      if (editingIndex && editingIndex.type === "twitterMention") {
        // Update existing mention
        const newMentions = [...mentions];
        newMentions[editingIndex.index] = twitterUser;
        setMentions(newMentions);
        setTwitterMentions(newMentions);
        setEditingIndex(null);
      } else {
        // Add new mention
        const newMentions = [...mentions, twitterUser];
        setMentions(newMentions);
        setTwitterMentions(newMentions);
      }

      setInputValue("");
      setError(null);
    } catch (err) {
      console.error("Error adding Twitter mention:", err);
      setError("Failed to add Twitter mention");
    }
  };

  const handleDeleteMention = (index: number) => {
    const newMentions = mentions.filter((_, i) => i !== index);
    setMentions(newMentions);
    setTwitterMentions(newMentions);
  };

  const handleEditMention = (index: number) => {
    const mention = mentions[index];
    setInputValue(mention.username);
    setEditingIndex({ type: "twitterMention", index });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TwitterOutlined style={{ color: "#1DA1F2", fontSize: 18 }} />
          <h3>Twitter Mentions</h3>
        </div>
      </div>

      <Card styles={{ body: { margin: 0, padding: 0 } }} variant="borderless">
        <div className="flex items-start space-x-2 mb-3">
          <div className="flex-1">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter Twitter username"
                className="pl-8"
                prefix={
                  <TwitterOutlined
                    style={{ color: "rgba(255, 255, 255, 0.5)" }}
                  />
                }
                onPressEnter={!isLoading ? handleAddMention : undefined}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button onClick={handleAddMention} size="middle" disabled={isLoading}>
            {isLoading ? <LoadingOutlined style={{ marginRight: 4 }} /> : null}
            {editingIndex !== null ? "Update" : "Add"}
          </Button>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{
              marginBottom: 12,
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              borderColor: "rgba(220, 38, 38, 0.3)",
            }}
          />
        )}

        <div className="flex items-start gap-2 mb-3">
          <InfoCircleOutlined
            style={{ color: "var(--color-brand)", marginTop: 2, flexShrink: 0 }}
          />
          <p className="text-xs text-[var(--text-secondary)]">
            Add Twitter accounts that your character will interact with in
            tweets. The character will occasionally tag these accounts.
            {!characterId &&
              " Save the character first to verify Twitter usernames."}
          </p>
        </div>

        {mentions.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {mentions.map((mention, index) => (
              <div
                key={index}
                className="group relative flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full text-xs"
                title={
                  mention.id
                    ? `Twitter ID: ${mention.id}`
                    : "Twitter ID not verified"
                }
              >
                <TwitterOutlined style={{ fontSize: 12 }} />
                <span>{mention.username}</span>
                <Button
                  onClick={() => handleEditMention(index)}
                  type="text"
                  size="small"
                  className="ml-1 text-zinc-400 hover:text-blue-400"
                  style={{ minWidth: "auto", padding: "0 4px" }}
                  icon={<EditOutlined style={{ fontSize: 12 }} />}
                />
                <Button
                  onClick={() => handleDeleteMention(index)}
                  type="text"
                  size="small"
                  className="ml-1 text-zinc-400 hover:text-red-400"
                  style={{ minWidth: "auto", padding: "0 4px" }}
                  icon={<CloseOutlined style={{ fontSize: 12 }} />}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3  rounded-md border border-[var(--color-gray)]">
            <p className="text-xs text-zinc-500">
              No Twitter mentions added yet
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

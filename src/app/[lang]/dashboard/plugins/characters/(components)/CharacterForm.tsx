"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Card, Tabs, Button, Alert, Space } from "antd";
import {
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  BasicInfoSection,
  TwitterSettings,
  ContentSections,
  MessageExamples,
  PostExamples,
  TopicsAndAdjectives,
  StyleSettings,
  TestSection,
  TwitterMentions,
  CharacterMedia,
} from "./index";
import {
  MediaItem,
  TwitterMention,
  CharacterFormData,
} from "@/types/character";
import {
  EditingIndex,
  processImage as processImageUtil,
  fetchCharacter as fetchCharacterData,
} from "@/lib/character";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { useToast } from "@/providers/ToastProvider";

interface CharacterFormProps {
  characterId?: string;
}

interface UIState {
  mode: "advanced" | "test";
  editingIndex: EditingIndex;
  error: string | null;
  loading: boolean;
  isOpen: {
    bio: boolean;
    lore: boolean;
    knowledge: boolean;
    messageExamples: boolean;
    postExamples: boolean;
    styleAll: boolean;
    styleChat: boolean;
    stylePost: boolean;
  };
}


export function CharacterForm({ characterId }: CharacterFormProps) {

  // Main configuration state
  const [config, setConfig] = useState<CharacterFormData>({
    id: "",
    name: "",
    createdAt: "",
    updatedAt: "",
    settings: {
      system: "",
      twitter: {
        postWithImages: true,
        username: "",
        mentions: [],
      },
      media: [],
      bio: [],
      lore: [],
      knowledge: [],
      messageExamples: [],
      postExamples: [],
      adjectives: [],
      topics: [],
      style: {
        all: [],
        chat: [],
        post: [],
      },
      voice: {
        model: "en_US-hfc_female-medium",
      },
    },
    avatarUrl: "",
  });

  // UI state
  const [uiState, setUiState] = useState<UIState>({
    mode: "advanced",
    editingIndex: null,
    error: null,
    loading: false,
    isOpen: {
      bio: false,
      lore: false,
      knowledge: false,
      messageExamples: false,
      postExamples: false,
      styleAll: false,
      styleChat: false,
      stylePost: false,
    },
  });

  const toast = useToast();

  // Helper function to update config - wrapped in useCallback
  const updateConfig = useCallback((updates: Partial<CharacterFormData>) => {
    setConfig((prev) => ({
      ...prev,
      ...updates,
      settings: {
        ...prev.settings,
        ...(updates.settings || {}),
      },
    }));
  }, []);

  // Helper function to update settings - wrapped in useCallback
  const updateSettings = useCallback((updates: Partial<CharacterFormData["settings"]>) => {
    setConfig((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
        twitter: {
          postWithImages:
            updates.twitter?.postWithImages ??
            prev.settings.twitter?.postWithImages ??
            true,
          username:
            updates.twitter?.username ??
            prev.settings.twitter?.username ??
            "",
          mentions:
            updates.twitter?.mentions ??
            prev.settings.twitter?.mentions ??
            [],
        },
      },
    }));
  }, []);

  // Log when media is updated for debugging
  useEffect(() => {
    if (config.settings.media && config.settings.media.length > 0) {
      console.log("Media in config updated:", config.settings.media);
    }
  }, [config.settings.media]);

  const processImage = useCallback((imageDataUrl: string) => {
    processImageUtil(imageDataUrl, (url) => updateConfig({ avatarUrl: url }));
  }, [updateConfig]);

  // Fix dropzone issue by destructuring only what's needed
  useDropzone({
    onDrop: (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          processImage(result);
        };
        reader.readAsDataURL(file);
      }
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
  });

  // Helper function to update UI state - wrapped in useCallback
  const updateUiState = useCallback((updates: Partial<UIState>) => {
    setUiState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  useEffect(() => {
    if (characterId) {
      const fetchCharacter = async () => {
        try {
          updateUiState({ loading: true });
          const character = await fetchCharacterData(characterId);

          // Type guard to check if character has expected structure
          if (!character || typeof character !== "object") {
            throw new Error("Invalid character data received");
          }

          const characterData = character as Record<string, unknown>;

          updateConfig({
            id: characterData.id as string || "",
            name: characterData.name as string || "",
            createdAt: characterData.createdAt as string || "",
            updatedAt: characterData.updatedAt as string || "",
            avatarUrl: characterData.avatarUrl as string || "",
            settings: {
              system: characterData.system as string || "",
              chat_active: characterData.chat_active !== undefined ? characterData.chat_active as boolean : true,
              twitter: {
                postWithImages:
                  characterData.postWithImages === false ? false : true,
                username: characterData.twitterUsername as string || "",
                mentions: characterData.twitterMentions as TwitterMention[] || [],
              },
              media: Array.isArray(characterData.media)
                ? characterData.media.map((item: string | MediaItem) => {
                    if (typeof item === "string") {
                      return { url: item, type: "promo" };
                    } else if (
                      typeof item === "object" &&
                      item !== null &&
                      "url" in item
                    ) {
                      return {
                        url: String(item.url || ""),
                        type: String(item.type || "promo"),
                      };
                    }
                    return { url: String(item || ""), type: "promo" };
                  })
                : [],
              bio: Array.isArray(characterData.bioItems)
                ? characterData.bioItems as string[]
                : [],
              lore: Array.isArray(characterData.loreItems)
                ? characterData.loreItems as string[]
                : [],
              knowledge: Array.isArray(characterData.knowledgeItems)
                ? characterData.knowledgeItems.map(
                    (item: unknown, index: number) => ({
                      id: `k${index}`,
                      path: "manual",
                      content: String(item || ""),
                    })
                  )
                : [],
              messageExamples: Array.isArray(characterData.messageExamples)
                ? characterData.messageExamples
                : [],
              postExamples: Array.isArray(characterData.postExamples)
                ? characterData.postExamples as string[]
                : [],
              adjectives: Array.isArray(characterData.adjectives)
                ? characterData.adjectives as string[]
                : [],
              topics: Array.isArray(characterData.topics)
                ? characterData.topics as string[]
                : [],
              style: {
                all: Array.isArray(characterData.styleAll)
                  ? characterData.styleAll as string[]
                  : [],
                chat: Array.isArray(characterData.styleChat)
                  ? characterData.styleChat as string[]
                  : [],
                post: Array.isArray(characterData.stylePost)
                  ? characterData.stylePost as string[]
                  : [],
              },
              voice: {
                model: characterData.voiceModel as string || "en_US-hfc_female-medium",
              },
            },
          });

          // Twitter settings
          const characterObj = characterData as Record<string, unknown>;

          // Check if character has socials information
          if (characterObj.socials && Array.isArray(characterObj.socials)) {
            interface SocialConnection {
              platform: string;
              connected: boolean;
              platformUsername?: string;
            }

            const twitterSocial = (
              characterObj.socials as SocialConnection[]
            ).find((social) => social.platform === "twitter");

            if (twitterSocial && !twitterSocial.connected) {
              updateSettings({
                twitter: {
                  postWithImages: true,
                  username:
                    typeof characterObj.twitterUsername === "string"
                      ? characterObj.twitterUsername
                      : "",
                  mentions: [],
                },
              });
            }
          }
        } catch (err) {
          console.error("Error fetching character:", err);
          updateUiState({ error: "Failed to load character" });
        } finally {
          updateUiState({ loading: false });
        }
      };

      fetchCharacter();
    }
  }, [characterId, updateConfig, updateSettings, updateUiState]);

  const handleModeChange = (newMode: "advanced" | "test") => {
    updateUiState({ mode: newMode });
  };

  const handleSave = async () => {
    if (!config.name.trim()) {
      toast.warning("Character name is required", "Character name is required");
      return;
    }

    updateUiState({ loading: true, error: null });

    try {
      const formattedMessageExamples = [];
      if (config.settings.messageExamples?.length) {
        for (const example of config.settings.messageExamples) {
          formattedMessageExamples.push({
            user: example.user || "user",
            content: {
              text: example.content && example.content.text
                    ? example.content.text
                    : "",
            },
          });
        }
      }

      const manualData = {
        name: config.name,
        avatarUrl: config.avatarUrl,
        settings: {
          ...config.settings,
          messageExamples: formattedMessageExamples,
          knowledge: config.settings.knowledge?.length
            ? config.settings.knowledge
            : [
                {
                  id: "k0",
                  path: "manual",
                  content: "Default knowledge item",
                },
              ],
        },
      };

      if (characterId) {
        await api.put(
          `/api/character/${characterId}`,
          manualData
        );
      } else {
        await api.post("/api/character", manualData);
      }
    } catch (err) {
      console.error("Error saving character:", err);
      if (err instanceof AxiosError && err.response?.data) {
        console.error("API error response:", err.response.data);
        updateUiState({
          error: err.response.data.error || "Failed to save character",
        });
      } else if (err instanceof Error) {
        updateUiState({ error: err.message });
      } else {
        updateUiState({ error: "Failed to save character" });
      }
    } finally {
      updateUiState({ loading: false });
    }
  };

  const getMediaType = (url: string): string => {
    const mediaItem = config.settings.media?.find((item) => item.url === url);
    return mediaItem ? mediaItem.type : "promo";
  };

  const handleMediaTypeChange = (url: string, type: string) => {
    if (!config.settings.media) return;
    updateSettings({
      media: config.settings.media.map((item) => {
        if (item.url === url) {
          return { ...item, type };
        }
        return item;
      }),
    });
  };

  // Add validation helper to prevent exceeding character limits
  const validateAndUpdateText = useCallback((value: string, maxLength: number, fieldName: string): string => {
    if (value.length > maxLength) {
      toast.warning(`Maximum ${maxLength} characters allowed`, `${fieldName} exceeds limit`);
      return value.substring(0, maxLength);
    }
    return value;
  }, [toast]);

  // Add validator for bio items
  const validateAndUpdateBio = useCallback((items: string[]): string[] => {
    if (items.length > 50) {
      toast.warning('Maximum 50 bio items allowed', 'Bio items limit exceeded');
      return items.slice(0, 50);
    }
    
    return items.map((item, index) => {
      if (item.length > 500) {
        toast.warning(`Bio item must be 500 characters or less`, `Bio item ${index + 1} too long`);
        return item.substring(0, 500);
      }
      return item;
    });
  }, [toast]);

  // Add validator for lore items
  const validateAndUpdateLore = useCallback((items: string[]): string[] => {
    if (items.length > 50) {
      toast.warning('Maximum 50 lore items allowed', 'Lore items limit exceeded');
      return items.slice(0, 50);
    }
    
    return items.map((item, index) => {
      if (item.length > 500) {
        toast.warning(`Lore item must be 500 characters or less`, `Lore item ${index + 1} too long`);
        return item.substring(0, 500);
      }
      return item;
    });
  }, [toast]);

  // Add validator for knowledge items
  const validateAndUpdateKnowledge = useCallback((items: string[]): string[] => {
    if (items.length > 30) {
      toast.warning('Maximum 30 knowledge items allowed', 'Knowledge items limit exceeded');
      return items.slice(0, 30);
    }
    
    return items.map((item, index) => {
      if (item.length > 2000) {
        toast.warning(`Knowledge item must be 2000 characters or less`, `Knowledge item ${index + 1} too long`);
        return item.substring(0, 2000);
      }
      return item;
    });
  }, [toast]);

  // Add validator for post examples
  const validateAndUpdatePosts = useCallback((items: string[]): string[] => {
    if (items.length > 50) {
      toast.warning('Maximum 50 post examples allowed', 'Post examples limit exceeded');
      return items.slice(0, 50);
    }
    
    return items.map((item, index) => {
      if (item.length > 250) {
        toast.warning(`Post example must be 250 characters or less`, `Post ${index + 1} too long`);
        return item.substring(0, 250);
      }
      return item;
    });
  }, [toast]);

  // Add validator for message examples to check array and content
  const validateAndUpdateMessages = useCallback((
    items: Array<Array<{ user: string; content: { text: string } }>>
  ): Array<Array<{ user: string; content: { text: string } }>> => {
    if (items.length > 50) {
      toast.warning('Maximum 50 message examples allowed', 'Message examples limit exceeded');
      return items.slice(0, 50);
    }
    
    return items.map(conversation => {
      return conversation.map(message => {
        if (message.content && message.content.text && message.content.text.length > 250) {
          toast.warning(`Message must be 250 characters or less`, 'Message too long');
          return {
            ...message,
            content: {
              ...message.content,
              text: message.content.text.substring(0, 250)
            }
          };
        }
        return message;
      });
    });
  }, [toast]);

  // Add validator for Twitter mentions
  const validateAndUpdateTwitterMentions = useCallback((mentions: TwitterMention[]): TwitterMention[] => {
    if (mentions.length > 50) {
      toast.warning('Maximum 50 Twitter mentions allowed', 'Twitter mentions limit exceeded');
      return mentions.slice(0, 50);
    }
    return mentions;
  }, [toast]);

  // Add validator for system prompt
  const validateAndUpdateSystem = useCallback((text: string): string => {
    if (text.length > 6000) {
      toast.warning('System prompt must be 6000 characters or less', 'System prompt too long');
      return text.substring(0, 6000);
    }
    return text;
  }, [toast]);

  // Define tab items for Ant Design Tabs
  const tabItems = [
    {
      key: "advanced",
      label: "Advanced Mode",
      children: uiState.mode === "advanced" && (
        <div
          className="flex flex-col gap-20"
          style={{ width: "100%", marginTop: 24 }}
        >
          {/* Basic Info Section */}
          <BasicInfoSection
            name={config.name}
            setName={(value: string) => updateConfig({ name: value })}
            avatarUrl={config.avatarUrl || ""}
            setAvatarUrl={(value: string) => updateConfig({ avatarUrl: value })}
            voiceModel={
              config.settings.voice?.model || "en_US-hfc_female-medium"
            }
            setVoiceModel={(value: string) =>
              updateSettings({ voice: { model: value } })
            }
            system={config.settings.system || ""}
            setSystem={(value: string) => 
              updateSettings({ system: validateAndUpdateSystem(value) })
            }
            characterId={characterId}
            chatActive={config.settings.chat_active !== undefined ? config.settings.chat_active : true}
            setChatActive={(value: boolean) =>
              updateSettings({ chat_active: value })
            }
          />

          {/* Character Media */}
          <CharacterMedia
            characterId={characterId}
            media={config.settings.media?.map((item) => item.url) || []}
            setMedia={(urls: string[]) => {
              console.log("Setting media URLs in CharacterForm:", urls);
              // Force an immediate update to prevent flickering
              const updatedMedia = urls.map((url) => {
                const existingItem = config.settings.media?.find(
                  (item) => item.url === url
                );
                
                return {
                  url,
                  type: existingItem ? existingItem.type : "promo",
                };
              });
              
              // Check if a new media item was added
              if (updatedMedia.length > (config.settings.media?.length || 0)) {
                // Only show success message when new media is added
                toast.success("Media uploaded successfully");
              }
              
              // Use a timeout to ensure the component has time to process the change
              setTimeout(() => {
                updateSettings({
                  media: updatedMedia,
                });
              }, 0);
            }}
            getMediaType={getMediaType}
            onMediaTypeChange={handleMediaTypeChange}
            key={`character-media-${characterId}-${config.settings.media?.length || 0}`}
          />

          {/* Twitter Settings */}
          <TwitterSettings
            characterId={characterId}
            postWithImages={config.settings.twitter?.postWithImages ?? true}
            setPostWithImages={(value: boolean) =>
              updateSettings({
                twitter: {
                  postWithImages: value,
                  username: config.settings.twitter?.username ?? "",
                  mentions: config.settings.twitter?.mentions ?? [],
                },
              })
            }
          />

          {/* Twitter Mentions */}
          <TwitterMentions
            twitterMentions={config.settings.twitter?.mentions ?? []}
            setTwitterMentions={(value: TwitterMention[]) =>
              updateSettings({
                twitter: {
                  postWithImages:
                    config.settings.twitter?.postWithImages ?? true,
                  username: config.settings.twitter?.username ?? "",
                  mentions: validateAndUpdateTwitterMentions(value),
                },
              })
            }
            characterId={characterId}
          />
          {/* Topics and Adjectives */}
          <TopicsAndAdjectives
            adjectives={config.settings.adjectives || []}
            setAdjectives={(value: string[]) =>
              updateSettings({ adjectives: value })
            }
            topics={config.settings.topics || []}
            setTopics={(value: string[]) => updateSettings({ topics: value })}
          />

          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-5">
              <h3>Content</h3>
              {/* Content Sections */}
              <ContentSections
                bioItems={config.settings.bio || []}
                setBioItems={(value: string[]) =>
                  updateSettings({ bio: validateAndUpdateBio(value) })
                }
                loreItems={config.settings.lore || []}
                setLoreItems={(value: string[]) =>
                  updateSettings({ lore: validateAndUpdateLore(value) })
                }
                knowledgeItems={
                  config.settings.knowledge?.map((k) => k.content) || []
                }
                setKnowledgeItems={(value: string[]) =>
                  updateSettings({
                    knowledge: validateAndUpdateKnowledge(value).map((content, index) => ({
                      id: `k${index}`,
                      path: "manual",
                      content,
                    })),
                  })
                }
                initiallyOpen={{
                  bio: uiState.isOpen.bio,
                  lore: uiState.isOpen.lore,
                  knowledge: uiState.isOpen.knowledge,
                }}
              />
            </div>

            <div className="flex flex-col gap-5">
              <h3>Messages</h3>
              {/* Message Examples */}
              <MessageExamples
                messageExamples={
                  config.settings.messageExamples?.map((ex) => {
                    const contentWithText =
                      ex.content && typeof ex.content === "object"
                        ? ex.content
                        : { text: "" };

                    return [{
                      user: ex.user || "user",
                      content: { text: contentWithText.text || "" },
                    }];
                  }) || []
                }
                setMessageExamples={(
                  value: Array<Array<{ user: string; content: { text: string } }>>
                ) =>
                  updateSettings({
                    messageExamples: validateAndUpdateMessages(value).map((conversation) => {
                      // Get just the first message (user message) from each conversation
                      const userMsg = conversation[0] || { user: "user", content: { text: "" } };
                      return {
                        user: userMsg.user,
                        content: { text: userMsg.content?.text || "" },
                      };
                    }),
                  })
                }
                initiallyOpen={uiState.isOpen.messageExamples}
              />
            </div>

            <div className="flex flex-col gap-5">
              <h3>Posts</h3>
              {/* Post Examples */}
              <PostExamples
                postExamples={config.settings.postExamples || []}
                setPostExamples={(value: string[]) =>
                  updateSettings({ postExamples: validateAndUpdatePosts(value) })
                }
                initiallyOpen={uiState.isOpen.postExamples}
              />
            </div>

            <div className="flex flex-col gap-5">
              <h3>Style Settings</h3>

              {/* Style Settings */}
              <StyleSettings
                styleAll={config.settings.style?.all || []}
                setStyleAll={(value: string[]) =>
                  updateSettings({
                    style: {
                      all: value,
                      chat: config.settings.style?.chat || [],
                      post: config.settings.style?.post || [],
                    },
                  })
                }
                styleChat={config.settings.style?.chat || []}
                setStyleChat={(value: string[]) =>
                  updateSettings({
                    style: {
                      all: config.settings.style?.all || [],
                      chat: value,
                      post: config.settings.style?.post || [],
                    },
                  })
                }
                stylePost={config.settings.style?.post || []}
                setStylePost={(value: string[]) =>
                  updateSettings({
                    style: {
                      all: config.settings.style?.all || [],
                      chat: config.settings.style?.chat || [],
                      post: value,
                    },
                  })
                }
                initiallyOpen={{
                  all: uiState.isOpen.styleAll,
                  chat: uiState.isOpen.styleChat,
                  post: uiState.isOpen.stylePost,
                }}
              />
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={uiState.loading || !config.name.trim()}
            type="primary"
          >
            {uiState.loading ? "Saving..." : "Save Character"}
          </Button>
        </div>
      ),
    },
    {
      key: "test",
      label: "Test Mode",
      children: uiState.mode === "test" && characterId && (
        <TestSection
          characterId={characterId}
          characterName={config.name}
          characterAvatar={config.avatarUrl || ""}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {uiState.error && (
        <Alert
          type="error"
          message={uiState.error}
          icon={<ExclamationCircleOutlined />}
          showIcon
        />
      )}

      <Card variant="outlined">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Tabs
            activeKey={uiState.mode}
            onChange={(value) => handleModeChange(value as "advanced" | "test")}
            items={tabItems}
          />
        </Space>
      </Card>
    </div>
  );
}
import baseApi from "./api";
import { AxiosError } from "axios";

// Types
export interface KnowledgeItem {
  id: string;
  path: string;
  content: string;
}

export interface MessageExample {
  user: string;
  content: {
    text: string;
  };
}

export interface TwitterMention {
  username: string;
  id?: string;
}

export type EditingIndex = {
  type: string;
  index: number;
} | null;

export interface CharacterSettings {
  secrets?: Record<string, unknown>;
  voice: {
    model: string;
  };
  twitter: {
    postWithImages: boolean;
    imagePromptTemplate?: string;
    username?: string;
    email?: string;
    password?: string;
    twoFactorSecret?: string;
    mentions?: TwitterMention[] | string[];
  };
  system: string;
  bio: string[];
  lore: string[];
  knowledge: KnowledgeItem[];
  messageExamples: Array<Array<MessageExample>>;
  postExamples: string[];
  adjectives: string[];
  topics: string[];
  people: string[];
  media?: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
}

// Dodajmo še nekaj dodatnih tipov za boljšo tipizacijo
export interface CharacterData {
  name: string;
  avatarUrl: string;
  settings: CharacterSettings;
}

export interface SettingsRecord extends Record<string, unknown> {
  knowledge?: Array<KnowledgeItem | string | unknown>;
  messageExamples?: Array<unknown>;
  style?: {
    all?: string[];
    chat?: string[];
    post?: string[];
  };
  voice?: {
    model?: string;
  };
  [key: string]: unknown;
}

/**
 * Processes an image to crop it to a square
 * @param imageDataUrl The data URL of the image to process
 * @param setAvatarUrl Function to set the processed avatar URL
 */
export const processImage = (
  imageDataUrl: string,
  setAvatarUrl: (url: string) => void
) => {
  const image = document.createElement("img");
  image.src = imageDataUrl;

  image.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Determine size (use smaller dimension)
    const size = Math.min(image.width, image.height);

    // Calculate crop position (center)
    const x = (image.width - size) / 2;
    const y = (image.height - size) / 2;

    // Set canvas size to 1:1 aspect ratio
    canvas.width = size;
    canvas.height = size;

    // Draw the cropped image
    ctx.drawImage(
      image,
      x,
      y, // Start at center
      size,
      size, // Take square from center
      0,
      0, // Place at canvas origin
      size,
      size // Use full canvas size
    );

    // Convert to base64
    const croppedImage = canvas.toDataURL("image/jpeg");
    setAvatarUrl(croppedImage);
  };
};

/**
 * Adds an item to a list
 * @param value The value to add
 * @param items The current list of items
 * @param setItems Function to update the list of items
 * @param setValue Function to reset the input value
 * @param type The type of item being added (for editing)
 * @param editingIndex Current editing state
 * @param setEditingIndex Function to update editing state
 */
export const handleAddItem = (
  value: string,
  items: string[],
  setItems: (items: string[]) => void,
  setValue: (value: string) => void,
  type: string,
  editingIndex: EditingIndex,
  setEditingIndex: (index: EditingIndex) => void
) => {
  if (value.trim()) {
    if (editingIndex && editingIndex.type === type) {
      const newItems = [...items];
      newItems[editingIndex.index] = value.trim();
      setItems(newItems);
      setEditingIndex(null);
    } else {
      setItems([...items, value.trim()]);
    }
    setValue("");
  }
};

/**
 * Deletes an item from a list
 * @param index The index of the item to delete
 * @param items The current list of items
 * @param setItems Function to update the list of items
 */
export const handleDeleteItem = <T>(
  index: number,
  items: T[],
  setItems: (items: T[]) => void
) => {
  setItems(items.filter((_, i) => i !== index));
};

/**
 * Sets up editing for an item
 * @param index The index of the item to edit
 * @param item The item value
 * @param setValue Function to set the input value
 * @param type The type of item being edited
 * @param setEditingIndex Function to update editing state
 */
export const handleEditItem = (
  index: number,
  item: string,
  setValue: (value: string) => void,
  type: string,
  setEditingIndex: (index: EditingIndex) => void
) => {
  setValue(item);
  setEditingIndex({ type, index });
};

/**
 * Parses knowledge items from different possible formats
 * @param knowledge The knowledge items to parse
 * @returns An array of knowledge item strings
 */
export const parseKnowledgeItems = (
  knowledge: Array<KnowledgeItem | string>
): string[] => {
  if (knowledge.length === 0) {
    return [];
  }

  // Check if the first item is a string
  if (typeof knowledge[0] === "string") {
    // Handle array of strings format
    return knowledge as string[];
  } else {
    // Handle array of objects format with content property
    return knowledge.map((k: KnowledgeItem | string) => {
      if (typeof k === "string") return k;
      return k.content;
    });
  }
};

/**
 * Parse the Twitter mentions in a more robust way
 * @param mentions The mentions to parse
 * @returns An array of TwitterMention objects
 */
export const parseTwitterMentions = (
  mentions: Array<TwitterMention | string> | undefined
): TwitterMention[] => {
  if (!mentions || !Array.isArray(mentions) || mentions.length === 0) {
    return [];
  }

  return mentions.map((mention) => {
    if (typeof mention === "string") {
      return { username: mention };
    } else if (
      typeof mention === "object" &&
      mention !== null &&
      "username" in mention
    ) {
      return mention as TwitterMention;
    }
    return { username: String(mention || "") };
  });
};

/**
 * Parses a JSON configuration string
 * @param jsonStr The JSON string to parse
 * @returns The parsed character configuration
 */
export const parseJsonConfig = (jsonStr: string) => {
  try {
    const config = JSON.parse(jsonStr);
    return {
      name: config.name || "",
      voiceModel: config.settings?.voice?.model || "en_US-hfc_female-medium",
      postWithImages: config.settings?.twitter?.postWithImages || true,
      system: config.system || "",
      bioItems: config.bio || [],
      loreItems: config.lore || [],
      knowledgeItems: parseKnowledgeItems(config.knowledge || []),
      messageExamples: config.messageExamples || [],
      postExamples: config.postExamples || [],
      adjectives: config.adjectives || [],
      topics: config.topics || [],
      styleAll: config.style?.all || [],
      styleChat: config.style?.chat || [],
      stylePost: config.style?.post || [],
      twitterUsername: config.settings?.twitter?.username || "",
      twitterEmail: config.settings?.twitter?.email || "",
      twitterPassword: config.settings?.twitter?.password || "",
      twitter2FA: config.settings?.twitter?.twoFactorSecret || "",
      twitterMentions: parseTwitterMentions(config.settings?.twitter?.mentions),
      media: config.settings?.media || [],
    };
  } catch (err) {
    console.error("Error parsing JSON:", err);
    throw new Error("Failed to parse JSON configuration");
  }
};

/**
 * Tests a character with a message
 * @param characterId The ID of the character to test
 * @param testMessage The message to test with
 * @returns The character's response
 */
export const testCharacter = async (
  characterId: string,
  testMessage: string
) => {
  try {
    console.log("Sending test message to character:", testMessage);
    const response = await baseApi.post(
      `/api/character/${characterId}/test`,
      {
        message: testMessage,
      },
      {
        timeout: 60000, // Povečan timeout na 1 minuto
      }
    );

    console.log("Full API response:", response);

    // Check if response.data exists and has the expected structure
    if (response.data) {
      // If response.data is directly the response text (string)
      if (typeof response.data === "string") {
        return { response: response.data };
      }

      // If response.data has a text property (from API)
      if ("text" in response.data) {
        return { 
          text: response.data.text,
          response: response.data.text // For backward compatibility
        };
      }

      // If response.data has a response property
      if ("response" in response.data) {
        return { response: response.data.response };
      }

      // If response.data itself is the response object
      return { response: response.data };
    }

    // Fallback if response structure is unexpected
    return { response: "Received response in unexpected format" };
  } catch (err) {
    console.error("Error testing character:", err);
    if (err instanceof AxiosError && err.response?.data?.error) {
      throw new Error(err.response.data.error);
    } else {
      throw new Error("Failed to test character");
    }
  }
};

/**
 * Generates a character configuration from a description
 * @param description The character description
 * @param name The character name
 * @returns The generated character configuration
 */
export const generateCharacter = async (description: string, name: string) => {
  try {
    const response = await baseApi.post(
      "/api/character/generate",
      {
        description,
        name: name || "New Character",
      },
      { timeout: 120000 }
    );
    return response.data;
  } catch (err) {
    console.error("Error generating character:", err);
    if (err instanceof AxiosError && err.response?.data?.error) {
      throw new Error(err.response.data.error);
    } else {
      throw new Error("Failed to generate character configuration");
    }
  }
};

/**
 * Saves a character to the database
 * @param characterId The ID of the character to update, or undefined to create a new character
 * @param characterData The character data to save
 * @returns The saved character data
 */
export const saveCharacter = async (
  characterId: string | undefined,
  characterData: Record<string, unknown>
) => {
  try {
    // Create a deep copy of the character data to avoid modifying the original
    const dataToSend = JSON.parse(JSON.stringify(characterData));

    // Ensure settings object exists
    if (!dataToSend.settings) {
      dataToSend.settings = {};
    }

    const settings = dataToSend.settings as SettingsRecord;

    // Ensure knowledge array exists and has proper format
    if (
      !settings.knowledge ||
      !Array.isArray(settings.knowledge) ||
      settings.knowledge.length === 0
    ) {
      // Create a default knowledge item if none exists
      settings.knowledge = [
        {
          id: "k0",
          path: "manual",
          content: "Example knowledge",
        },
      ];
    } else {
      // Ensure each knowledge item has the required fields
      settings.knowledge = settings.knowledge.map(
        (item: KnowledgeItem | string | unknown, index: number) => {
          if (typeof item === "string") {
            return {
              id: `k${index}`,
              path: "manual",
              content: item || "",
            };
          } else if (item && typeof item === "object") {
            const knowledgeItem = item as Partial<KnowledgeItem>;
            return {
              id: knowledgeItem.id || `k${index}`,
              path: knowledgeItem.path || "manual",
              content: knowledgeItem.content || "",
            };
          } else {
            return {
              id: `k${index}`,
              path: "manual",
              content: `Knowledge item ${index + 1}`,
            };
          }
        }
      );
    }

    // Ensure messageExamples array exists and has proper format
    if (
      !settings.messageExamples ||
      !Array.isArray(settings.messageExamples) ||
      settings.messageExamples.length === 0
    ) {
      // Create a default message example if none exists
      settings.messageExamples = [
        [
          { user: "user", content: { text: "Example user message" } },
          {
            user: "assistant",
            content: { text: "Example assistant response" },
          },
        ],
      ];
    } else {
      // Ensure each message example has the required format
      settings.messageExamples = settings.messageExamples.map(
        (example: unknown) => {
          if (!Array.isArray(example) || example.length !== 2) {
            return [
              { user: "user", content: { text: "Example user message" } },
              {
                user: "assistant",
                content: { text: "Example assistant response" },
              },
            ];
          } else {
            return example.map((msg: unknown) => {
              const message = msg as Partial<MessageExample> & {
                content?: Partial<{ text: string }>;
              };
              return {
                user: message.user || "user",
                content: {
                  text: message.content?.text || "",
                },
              };
            });
          }
        }
      );
    }

    // Ensure other required arrays exist
    settings.plugins = Array.isArray(settings.plugins) ? settings.plugins : [];
    settings.clients = Array.isArray(settings.clients) ? settings.clients : [];
    settings.people = Array.isArray(settings.people) ? settings.people : [];
    settings.bio = Array.isArray(settings.bio) ? settings.bio : [];
    settings.lore = Array.isArray(settings.lore) ? settings.lore : [];
    settings.postExamples = Array.isArray(settings.postExamples)
      ? settings.postExamples
      : [];
    settings.adjectives = Array.isArray(settings.adjectives)
      ? settings.adjectives
      : [];
    settings.topics = Array.isArray(settings.topics) ? settings.topics : [];

    // Ensure style object exists and has required arrays
    if (!settings.style || typeof settings.style !== "object") {
      settings.style = { all: [], chat: [], post: [] };
    } else {
      const styleObj = settings.style as {
        all?: string[];
        chat?: string[];
        post?: string[];
      };
      settings.style = {
        all: Array.isArray(styleObj.all) ? styleObj.all : [],
        chat: Array.isArray(styleObj.chat) ? styleObj.chat : [],
        post: Array.isArray(styleObj.post) ? styleObj.post : [],
      };
    }

    // Ensure required provider fields exist
    settings.modelProvider = settings.modelProvider || "openai";
    settings.imageModelProvider = settings.imageModelProvider || "openai";
    settings.videoModelProvider = settings.videoModelProvider || "openai";

    // Ensure voice settings exist
    if (!settings.voice || typeof settings.voice !== "object") {
      settings.voice = { model: "en_US-hfc_female-medium" };
    } else {
      const voiceObj = settings.voice as { model?: string };
      settings.voice = {
        model: voiceObj.model || "en_US-hfc_female-medium",
      };
    }

    // Ensure system prompt exists
    settings.system = settings.system || "You are a helpful assistant.";

    // Ensure secrets object exists
    settings.secrets = settings.secrets || {};

    // Dodatno preverjanje knowledge items - zagotovi, da so vsi elementi pravilno oblikovani
    for (let i = 0; i < settings.knowledge.length; i++) {
      const item = settings.knowledge[i] as Partial<KnowledgeItem>;
      // Če element ni objekt ali nima zahtevanih polj, ga zamenjaj z veljavnim elementom
      if (
        !item ||
        typeof item !== "object" ||
        !item.id ||
        !item.path ||
        !item.content
      ) {
        settings.knowledge[i] = {
          id: `k${i}`,
          path: "manual",
          content:
            typeof item === "string"
              ? item
              : item && typeof item === "object" && "content" in item
              ? (item.content as string)
              : `Knowledge item ${i + 1}`,
        };
      }
    }

    // Log the final data to be sent
    console.log(
      "Final data to be sent to API:",
      JSON.stringify(dataToSend, null, 2)
    );
    console.log(
      "Knowledge items structure:",
      JSON.stringify(settings.knowledge, null, 2)
    );

    // Send the data to the API
    let response;
    if (characterId) {
      response = await baseApi.put(`/api/character/${characterId}`, dataToSend);
    } else {
      response = await baseApi.post("/api/character", dataToSend);
    }

    return response.data;
  } catch (err) {
    console.error("Error saving character:", err);
    if (err instanceof AxiosError && err.response?.data?.error) {
      console.error("API error response:", err.response.data);
      throw new Error(err.response.data.error);
    } else {
      throw new Error("Failed to save character");
    }
  }
};

/**
 * Fetches a character by ID
 * @param characterId The ID of the character to fetch
 * @returns The character data
 */
export const fetchCharacter = async (characterId: string) => {
  try {
    const response = await baseApi.get(`/api/character/${characterId}`);
    const data = response.data;

    // Extract knowledge items content
    let knowledgeItems: string[] = [];
    if (data.settings?.knowledge && Array.isArray(data.settings.knowledge)) {
      // Extract content from knowledge items
      knowledgeItems = data.settings.knowledge
        .map((item: unknown) => {
          // Check if item is already a string
          if (typeof item === "string") return item;

          // Check if item is an object with content property
          if (item && typeof item === "object" && "content" in item) {
            return (item as { content: unknown }).content as string;
          }

          // Return empty string for invalid items
          return "";
        })
        .filter(Boolean); // Remove empty strings

      console.log(
        "Extracted knowledge items in fetchCharacter:",
        knowledgeItems
      );
    }

    return {
      name: data.name,
      avatarUrl: data.avatarUrl || "",
      voiceModel: data.settings?.voice?.model || "en_US-hfc_female-medium",
      postWithImages: data.settings?.twitter?.postWithImages || true,
      system: data.settings?.system || "",
      bioItems: data.settings?.bio || [],
      loreItems: data.settings?.lore || [],
      knowledgeItems: knowledgeItems,
      messageExamples: data.settings?.messageExamples || [],
      postExamples: data.settings?.postExamples || [],
      adjectives: data.settings?.adjectives || [],
      topics: data.settings?.topics || [],
      styleAll: data.settings?.style?.all || [],
      styleChat: data.settings?.style?.chat || [],
      stylePost: data.settings?.style?.post || [],
      twitterUsername: data.settings?.twitter?.username || "",
      twitterEmail: data.settings?.twitter?.email || "",
      twitterPassword: data.settings?.twitter?.password || "",
      twitter2FA: data.settings?.twitter?.twoFactorSecret || "",
      twitterMentions: parseTwitterMentions(data.settings?.twitter?.mentions),
      media: data.settings?.media || [],
      // Include additional fields that might be needed in the UI
      modelProvider: data.settings?.modelProvider || "openai",
      imageModelProvider: data.settings?.imageModelProvider || "openai",
      videoModelProvider: data.settings?.videoModelProvider || "openai",
    };
  } catch (err) {
    console.error("Error fetching character:", err);
    if (err instanceof AxiosError && err.response?.data?.error) {
      throw new Error(err.response.data.error);
    } else {
      throw new Error("Failed to load character");
    }
  }
};

/**
 * Prepares character data for saving
 * @param formData The form data to prepare
 * @returns The prepared character data
 */
export const prepareCharacterData = (formData: Record<string, unknown>) => {
  // Ensure knowledge items have the correct format
  const knowledgeItems = [];

  // Get knowledge items from form data
  const rawKnowledgeItems = (formData.knowledgeItems as string[]) || [];

  // If no knowledge items, add a default one
  if (rawKnowledgeItems.length === 0) {
    knowledgeItems.push({
      id: "k0",
      path: "manual",
      content: "Example knowledge",
    });
  } else {
    // Process each knowledge item
    for (let i = 0; i < rawKnowledgeItems.length; i++) {
      const content = rawKnowledgeItems[i];
      knowledgeItems.push({
        id: `k${i}`,
        path: "manual",
        content: typeof content === "string" ? content : String(content || ""),
      });
    }
  }

  // Log the knowledge items for debugging
  console.log(
    "Knowledge items in prepareCharacterData:",
    JSON.stringify(knowledgeItems, null, 2)
  );

  // Prepare message examples
  const messageExamples = [];
  const rawMessageExamples =
    (formData.messageExamples as Array<Array<MessageExample>>) || [];

  // If no message examples, add a default one
  if (rawMessageExamples.length === 0) {
    messageExamples.push([
      { user: "user", content: { text: "Example user message" } },
      { user: "assistant", content: { text: "Example assistant response" } },
    ]);
  } else {
    // Process each message example
    for (const example of rawMessageExamples) {
      if (!Array.isArray(example) || example.length !== 2) {
        messageExamples.push([
          { user: "user", content: { text: "Example user message" } },
          {
            user: "assistant",
            content: { text: "Example assistant response" },
          },
        ]);
      } else {
        const formattedExample = example.map((msg) => ({
          user: msg.user || "user",
          content: {
            text: msg.content?.text || "",
          },
        }));
        messageExamples.push(formattedExample);
      }
    }
  }

  // Dodatno preverjanje knowledge items - zagotovi, da so vsi elementi pravilno oblikovani
  for (let i = 0; i < knowledgeItems.length; i++) {
    const item = knowledgeItems[i] as Partial<KnowledgeItem>;
    // Če element ni objekt ali nima zahtevanih polj, ga zamenjaj z veljavnim elementom
    if (
      !item ||
      typeof item !== "object" ||
      !item.id ||
      !item.path ||
      !item.content
    ) {
      knowledgeItems[i] = {
        id: `k${i}`,
        path: "manual",
        content:
          typeof item === "string"
            ? item
            : item && typeof item === "object" && "content" in item
            ? (item.content as string)
            : `Knowledge item ${i + 1}`,
      };
    }
  }

  const characterData = {
    name: formData.name || "New Character",
    avatarUrl: formData.avatarUrl || "",
    settings: {
      // Required provider fields - explicitly set these
      modelProvider: "openai",
      imageModelProvider: "openai",
      videoModelProvider: "openai",

      // Required array fields - explicitly set these as arrays
      plugins: [],
      clients: [],
      people: [],

      // Voice settings
      voice: {
        model: formData.voiceModel || "en_US-hfc_female-medium",
      },

      // Twitter settings
      twitter: {
        postWithImages: formData.postWithImages || true,
        username: formData.twitterUsername || "",
        email: formData.twitterEmail || "",
        password: formData.twitterPassword || "",
        twoFactorSecret: formData.twitterTwoFactorSecret || "",
        mentions: Array.isArray(formData.twitterMentions)
          ? formData.twitterMentions
          : [],
        imagePromptTemplate: "A photo of {name} doing {action}",
      },

      // Image generation settings
      imageGeneration: {
        model: "dall-e-3",
        width: 1024,
        height: 1024,
        generateWithPosts: true,
      },

      // Media files
      media: Array.isArray(formData.media) ? formData.media : [],

      // Content fields
      system: formData.system || "You are a helpful assistant.",
      bio: Array.isArray(formData.bioItems) ? formData.bioItems : [],
      lore: Array.isArray(formData.loreItems) ? formData.loreItems : [],
      knowledge: knowledgeItems,
      messageExamples: messageExamples,
      postExamples: Array.isArray(formData.postExamples)
        ? formData.postExamples
        : [],
      adjectives: Array.isArray(formData.adjectives) ? formData.adjectives : [],
      topics: Array.isArray(formData.topics) ? formData.topics : [],

      // Style settings
      style: {
        all: Array.isArray(formData.styleAll) ? formData.styleAll : [],
        chat: Array.isArray(formData.styleChat) ? formData.styleChat : [],
        post: Array.isArray(formData.stylePost) ? formData.stylePost : [],
      },

      // Additional required fields
      secrets: {},
    },
  };

  console.log(
    "Final character data in prepareCharacterData:",
    JSON.stringify(characterData, null, 2)
  );

  return characterData;
};

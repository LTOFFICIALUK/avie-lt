"use client";

import { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Alert,
  Badge,
  Spin,
} from "antd";
import {
  LeftOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  StarOutlined,
  BookOutlined,
  ReloadOutlined,
  SaveOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { CharacterNFTSelector } from "./CharacterNFTSelector";
import { CharacterGenerationProgress } from "./CharacterGenerationProgress";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEthereumWallet } from "@/components/EthereumWalletButton";
import type { NFT as NFTType } from "@/types/nft";
import { FiStar, FiBook, FiRotateCcw, FiSave, FiUser, FiEdit3, FiArrowLeft } from "react-icons/fi";

const { TextArea } = Input;

// Helper function to replace cn utility
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

interface Lore {
  id: string;
  title: string;
  description: string | null;
}

interface LoreQuestionOption {
  name: string;
  description?: string;
}

interface LoreQuestion {
  id: string;
  question: string;
  order: number;
  page: number | null;
  pageTitle: string | null;
  options: LoreQuestionOption[] | null;
}

interface CreateCharacterFormProps {
  onSuccess?: (characterId: string) => void;
}

export function CreateCharacterForm({ onSuccess }: CreateCharacterFormProps) {
  const router = useRouter();
  const [creationMethod, setCreationMethod] = useState<"description" | "lore">(
    "description"
  );
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lores, setLores] = useState<Lore[]>([]);
  const [selectedLore, setSelectedLore] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<LoreQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [totalPages, setTotalPages] = useState(0);
  const [pageQuestions, setPageQuestions] = useState<LoreQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>("");
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [nftData, setNftData] = useState<{ useNft: boolean; nft: NFTType | null }>({
    useNft: false,
    nft: null,
  });
  const [useNft, setUseNft] = useState(false);
  const [selectedNft, setSelectedNft] = useState<NFTType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showGenerationProgress, setShowGenerationProgress] = useState(false);
  const [generatingCharacterId, setGeneratingCharacterId] = useState<string | undefined>(undefined);

  // Get wallet connection status for both Solana and Ethereum
  const { connected: isSolanaWalletConnected } = useWallet();
  const { connected: isEthereumWalletConnected, showWalletModal: showEthereumWalletModal } = useEthereumWallet();
  
  // Check if either wallet is connected
  const isAnyWalletConnected = isSolanaWalletConnected || isEthereumWalletConnected;

  // Local storage keys
  const STORAGE_KEY_PREFIX = "character_creation_";
  const STORAGE_KEYS = {
    creationMethod: `${STORAGE_KEY_PREFIX}method`,
    description: `${STORAGE_KEY_PREFIX}description`,
    name: `${STORAGE_KEY_PREFIX}name`,
    avatarUrl: `${STORAGE_KEY_PREFIX}avatar`,
    selectedLore: `${STORAGE_KEY_PREFIX}selected_lore`,
    currentPage: `${STORAGE_KEY_PREFIX}current_page`,
    answers: `${STORAGE_KEY_PREFIX}answers`,
    nftData: `${STORAGE_KEY_PREFIX}nft_data`,
  };

  // Load saved form state from local storage
  useEffect(() => {
    try {
      // Only load if we're in a browser environment
      if (typeof window !== "undefined") {
        const savedCreationMethod = localStorage.getItem(
          STORAGE_KEYS.creationMethod
        );
        const savedName = localStorage.getItem(STORAGE_KEYS.name);
        const savedAvatarUrl = localStorage.getItem(STORAGE_KEYS.avatarUrl);

        if (savedCreationMethod) {
          setCreationMethod(savedCreationMethod as "description" | "lore");
        }

        if (savedName) {
          setName(savedName);
        }

        if (savedAvatarUrl) {
          setAvatarUrl(savedAvatarUrl);
        }

        // Load description if creation method is "description"
        if (savedCreationMethod === "description") {
          const savedDescription = localStorage.getItem(
            STORAGE_KEYS.description
          );
          if (savedDescription) {
            setDescription(savedDescription);
          }
        }

        // Load lore-related data if creation method is "lore"
        if (savedCreationMethod === "lore") {
          const savedSelectedLore = localStorage.getItem(
            STORAGE_KEYS.selectedLore
          );
          const savedCurrentPage = localStorage.getItem(
            STORAGE_KEYS.currentPage
          );
          const savedAnswers = localStorage.getItem(STORAGE_KEYS.answers);

          if (savedSelectedLore) {
            setSelectedLore(savedSelectedLore);
          }

          if (savedCurrentPage) {
            setCurrentPage(parseInt(savedCurrentPage, 10));
          }

          if (savedAnswers) {
            try {
              setAnswers(JSON.parse(savedAnswers));
            } catch (e) {
              console.error("Failed to parse saved answers:", e);
            }
          }
        }
      }
    } catch (e) {
      console.error("Error loading saved form state:", e);
    }
  }, [
    STORAGE_KEYS.creationMethod,
    STORAGE_KEYS.name,
    STORAGE_KEYS.avatarUrl,
    STORAGE_KEYS.description,
    STORAGE_KEYS.selectedLore,
    STORAGE_KEYS.currentPage,
    STORAGE_KEYS.answers,
  ]);

  // Save form state to local storage when it changes
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip saving on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.creationMethod, creationMethod);
        localStorage.setItem(STORAGE_KEYS.name, name);
        localStorage.setItem(STORAGE_KEYS.avatarUrl, avatarUrl);

        if (creationMethod === "description") {
          localStorage.setItem(STORAGE_KEYS.description, description);
        } else if (creationMethod === "lore") {
          if (selectedLore) {
            localStorage.setItem(STORAGE_KEYS.selectedLore, selectedLore);
          }
          localStorage.setItem(STORAGE_KEYS.currentPage, currentPage.toString());
          localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(answers));
        }

        // Show auto-save indicator
        setShowSavedIndicator(true);
        setTimeout(() => setShowSavedIndicator(false), 2000);
      }
    } catch (e) {
      console.error("Error saving form state:", e);
    }
  }, [
    creationMethod,
    name,
    avatarUrl,
    description,
    selectedLore,
    currentPage,
    answers,
    STORAGE_KEYS.creationMethod,
    STORAGE_KEYS.name,
    STORAGE_KEYS.avatarUrl,
    STORAGE_KEYS.description,
    STORAGE_KEYS.selectedLore,
    STORAGE_KEYS.currentPage,
    STORAGE_KEYS.answers,
  ]);

  const resetFormState = () => {
    // Clear all form state
    setCreationMethod("description");
    setDescription("");
    setName("");
    setAvatarUrl("");
    setSelectedLore(null);
    setCurrentPage(1);
    setAnswers({});
    setError(null);
    setGenerationProgress("");
    setUseNft(false);
    setSelectedNft(null);
    setNftData({ useNft: false, nft: null });

    // Clear local storage
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Error removing ${key} from localStorage:`, e);
      }
    });
  };

  // Fetch available lores
  useEffect(() => {
    const fetchLores = async () => {
      try {
        const response = await api.get("/api/lore");
        setLores(response.data);
      } catch (err) {
        console.error("Failed to fetch lores:", err);
        setError("Failed to load lore templates. Please try again later.");
      }
    };

    fetchLores();
  }, []);

  // Fetch questions for selected lore
  useEffect(() => {
    if (!selectedLore) return;

    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const response = await api.get(`/api/lore/${selectedLore}/questions`);
        const allQuestions = response.data;
        setQuestions(allQuestions);

        // Calculate total pages
        const pageNumbers = allQuestions.map((q: LoreQuestion) => q.page || 1);
        const maxPage = Math.max(...pageNumbers);
        setTotalPages(maxPage);

        // Set initial page questions
        const initialPageQuestions = allQuestions.filter((q: LoreQuestion) => {
          console.log(
            `Question ${q.id} page:`,
            q.page,
            "Current page:",
            1,
            "Match:",
            q.page === 1
          );
          return q.page === 1;
        });

        console.log("All questions:", allQuestions);
        console.log("Page numbers found:", pageNumbers);
        console.log("Initial page questions:", initialPageQuestions);

        setPageQuestions(initialPageQuestions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [selectedLore]);

  // Update page questions when current page changes
  useEffect(() => {
    if (questions.length === 0) return;

    // Filter questions for the current page and sort by order
    console.log("Current page:", currentPage, "typeof:", typeof currentPage);

    const filteredQuestions = questions
      .filter((q) => {
        console.log(
          `Question ${q.id} page:`,
          q.page,
          "typeof:",
          typeof q.page,
          "Current page:",
          currentPage,
          "Match:",
          Number(q.page) === currentPage
        );
        // Convert both to numbers to ensure consistent comparison
        return Number(q.page) === Number(currentPage);
      })
      .sort((a, b) => a.order - b.order);

    console.log(`Questions for page ${currentPage}:`, filteredQuestions);
    setPageQuestions(filteredQuestions);
  }, [currentPage, questions]);

  // Handle answer change with debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleAnswerChange = (questionId: string, value: string) => {
    // Update state immediately for UI responsiveness
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Debounce the save indicator to avoid flickering
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setShowSavedIndicator(true);

      setTimeout(() => {
        setShowSavedIndicator(false);
      }, 1500);

      debounceTimerRef.current = null;
    }, 500); // 500ms debounce
  };

  // Find available pages with questions
  const findAvailablePages = () => {
    const availablePages = Array.from(new Set(questions.map((q) => q.page)))
      .filter(Boolean)
      .map(Number)
      .sort((a, b) => a - b);

    console.log("Available pages:", availablePages);
    return availablePages;
  };

  // Navigate to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const availablePages = findAvailablePages();
      const currentIndex = availablePages.indexOf(currentPage);

      if (currentIndex !== -1 && currentIndex < availablePages.length - 1) {
        // Go to next available page
        const nextPage = availablePages[currentIndex + 1];
        console.log(`Navigating to next available page: ${nextPage}`);
        setCurrentPage(nextPage);
      } else {
        // Fallback to simple increment
        const nextPage = currentPage + 1;
        console.log(`Navigating to next page: ${nextPage}`);
        setCurrentPage(nextPage);
      }

      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const availablePages = findAvailablePages();
      const currentIndex = availablePages.indexOf(currentPage);

      if (currentIndex > 0) {
        // Go to previous available page
        const prevPage = availablePages[currentIndex - 1];
        console.log(`Navigating to previous available page: ${prevPage}`);
        setCurrentPage(prevPage);
      } else {
        // Fallback to simple decrement
        const prevPage = currentPage - 1;
        console.log(`Navigating to previous page: ${prevPage}`);
        setCurrentPage(prevPage);
      }

      window.scrollTo(0, 0);
    }
  };

  // Check if current page is complete
  const isCurrentPageComplete = () => {
    if (pageQuestions.length === 0) {
      return false;
    }
    const complete = pageQuestions.every((question) =>
      answers[question.id]?.trim()
    );
    console.log(
      `Page ${currentPage} complete:`,
      complete,
      "Questions:",
      pageQuestions.length
    );
    return complete;
  };

  // Check if character creation is ready (all required fields are filled)
  const isCharacterCreationReady = () => {
    // Name is required for both creation methods
    if (!name.trim()) {
      return false;
    }

    // For lore method, current page must be complete
    return isCurrentPageComplete();
  };

  // Convert lore answers to character description
  const convertLoreToDescription = () => {
    let fullDescription = `Character name: ${name}\n\n`;

    // Group questions by page
    const questionsByPage: Record<number, LoreQuestion[]> = {};
    questions.forEach((q) => {
      const page = q.page || 1;
      if (!questionsByPage[page]) {
        questionsByPage[page] = [];
      }
      questionsByPage[page].push(q);
    });

    // Sort pages numerically
    const sortedPages = Object.keys(questionsByPage)
      .map(Number)
      .sort((a, b) => a - b);

    // Build description from answers
    sortedPages.forEach((pageNum) => {
      const pageQuestions = questionsByPage[pageNum];
      // Sort questions by order
      pageQuestions.sort((a, b) => a.order - b.order);

      const pageTitle = pageQuestions[0]?.pageTitle;
      if (pageTitle) {
        fullDescription += `## ${pageTitle}\n\n`;
      } else {
        fullDescription += `## Page ${pageNum}\n\n`;
      }

      pageQuestions.forEach((question) => {
        const answer = answers[question.id];
        if (answer) {
          fullDescription += `**${question.question}**\n${answer}\n\n`;
        }
      });
    });

    return fullDescription;
  };

  // Handle NFT selection
  const handleNftChange = (data: { useNft: boolean; nft: NFTType | null }) => {
    setUseNft(data.useNft);
    setSelectedNft(data.nft);
    setNftData(data);
    
    // If NFT is selected, automatically update character form fields
    if (data.useNft && data.nft?.metadata) {
      const { name: nftName, description: nftDescription, attributes } = data.nft.metadata;
      
      // Update name if it exists in NFT metadata and current name is empty
      if (nftName && (!name || name === '')) {
        setName(nftName);
      }
      
      // Generate a more detailed description based on NFT data
      if (creationMethod === "description") {
        let enhancedDescription = description;
        
        // Create a base description if the current one is empty
        if (!enhancedDescription) {
          enhancedDescription = `Character based on NFT: ${nftName || 'Unnamed NFT'}\n\n`;
        }
        
        // Add NFT description if available and not already included
        if (nftDescription && !enhancedDescription.includes(nftDescription)) {
          enhancedDescription += `${nftDescription}\n\n`;
        }
        
        // Process attributes - extremely important for character generation
        if (attributes && attributes.length > 0) {
          let attributesText = "Character traits from NFT attributes:\n";
          
          // Categorize attributes
          const personalityTraits: string[] = [];
          const appearanceTraits: string[] = [];
          const backgroundTraits: string[] = [];
          const otherTraits: string[] = [];
          
          attributes.forEach(attr => {
            if (!attr.trait_type || !attr.value) return;
            
            const traitType = attr.trait_type.toLowerCase();
            const value = attr.value.toString();
            
            if (traitType.includes('personality') || 
                traitType.includes('trait') || 
                traitType.includes('character') ||
                traitType.includes('class') ||
                traitType.includes('alignment')) {
              personalityTraits.push(`${attr.trait_type}: ${value}`);
            }
            else if (traitType.includes('appearance') || 
                     traitType.includes('look') || 
                     traitType.includes('style') ||
                     traitType.includes('color') ||
                     traitType.includes('clothes') ||
                     traitType.includes('outfit') ||
                     traitType.includes('accessory')) {
              appearanceTraits.push(`${attr.trait_type}: ${value}`);
            }
            else if (traitType.includes('background') || 
                     traitType.includes('story') || 
                     traitType.includes('origin') ||
                     traitType.includes('lore') ||
                     traitType.includes('history')) {
              backgroundTraits.push(`${attr.trait_type}: ${value}`);
            }
            else {
              otherTraits.push(`${attr.trait_type}: ${value}`);
            }
          });
          
          // Add personality traits
          if (personalityTraits.length > 0) {
            attributesText += "\nPersonality:\n- " + personalityTraits.join("\n- ") + "\n";
          }
          
          // Add appearance traits
          if (appearanceTraits.length > 0) {
            attributesText += "\nAppearance:\n- " + appearanceTraits.join("\n- ") + "\n";
          }
          
          // Add background traits
          if (backgroundTraits.length > 0) {
            attributesText += "\nBackground:\n- " + backgroundTraits.join("\n- ") + "\n";
          }
          
          // Add other traits
          if (otherTraits.length > 0) {
            attributesText += "\nOther traits:\n- " + otherTraits.join("\n- ") + "\n";
          }
          
          // Add attributes to description if not already included
          if (!enhancedDescription.includes("Character traits from NFT attributes")) {
            enhancedDescription += attributesText;
          }
        }
        
        // Update description state
        setDescription(enhancedDescription);
      } 
      // For lore-based creation, update answers with NFT data
      else if (creationMethod === "lore" && attributes && attributes.length > 0) {
        const newAnswers = { ...answers };
        
        questions.forEach(question => {
          const questionText = question.question.toLowerCase();
          
          // Match personality questions with personality attributes
          if (questionText.includes('personality') || 
              questionText.includes('character') || 
              questionText.includes('traits') ||
              questionText.includes('nature')) {
            
            const personalityAttrs = attributes.filter(attr => {
              const traitType = (attr.trait_type || '').toLowerCase();
              return traitType.includes('personality') || 
                     traitType.includes('trait') || 
                     traitType.includes('character') ||
                     traitType.includes('alignment');
            });
            
            if (personalityAttrs.length > 0 && !answers[question.id]) {
              newAnswers[question.id] = personalityAttrs
                .map(attr => `${attr.trait_type}: ${attr.value}`)
                .join(', ');
            }
          }
          
          // Match appearance questions with appearance attributes
          else if (questionText.includes('appearance') || 
                   questionText.includes('look') || 
                   questionText.includes('outfit') ||
                   questionText.includes('visual')) {
            
            const appearanceAttrs = attributes.filter(attr => {
              const traitType = (attr.trait_type || '').toLowerCase();
              return traitType.includes('appearance') || 
                     traitType.includes('look') || 
                     traitType.includes('style') ||
                     traitType.includes('color') ||
                     traitType.includes('clothes') ||
                     traitType.includes('outfit') ||
                     traitType.includes('accessory');
            });
            
            if (appearanceAttrs.length > 0 && !answers[question.id]) {
              newAnswers[question.id] = appearanceAttrs
                .map(attr => `${attr.trait_type}: ${attr.value}`)
                .join(', ');
            }
          }
          
          // Match background questions with background attributes
          else if (questionText.includes('background') || 
                   questionText.includes('story') || 
                   questionText.includes('history')) {
            
            const backgroundAttrs = attributes.filter(attr => {
              const traitType = (attr.trait_type || '').toLowerCase();
              return traitType.includes('background') || 
                     traitType.includes('story') || 
                     traitType.includes('origin') ||
                     traitType.includes('lore') ||
                     traitType.includes('history');
            });
            
            if (backgroundAttrs.length > 0 && !answers[question.id]) {
              newAnswers[question.id] = backgroundAttrs
                .map(attr => `${attr.trait_type}: ${attr.value}`)
                .join(', ');
            }
          }
        });
        
        // Update answers if we found matches
        if (Object.keys(newAnswers).length > Object.keys(answers).length) {
          setAnswers(newAnswers);
        }
      }
      
      // Set NFT image as character avatar if available
      if (data.nft.metadata.image) {
        const imageUrl = data.nft.metadata.image;
        // Handle IPFS URLs
        const formattedImageUrl = imageUrl.startsWith('ipfs://') 
          ? `https://ipfs.io/ipfs/${imageUrl.replace('ipfs://', '')}`
          : imageUrl;
        setAvatarUrl(formattedImageUrl);
      }
    }
  };

  // Handle wallet connection button click
  const handleConnectWalletClick = () => {
    // Try opening the multi-wallet dialog first
    const walletButton = document.querySelector(
      "button[aria-label='Open wallet options']"
    );
    
    if (walletButton) {
      // Click the multi-wallet button to show options
      walletButton.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    } else {
      // If multi-wallet not found, try Ethereum wallet
      if (showEthereumWalletModal) {
        showEthereumWalletModal();
      } else {
        // Fallback to Solana wallet
        const solanaWalletButton = document.querySelector(
          "[data-wallet-adapter-button-trigger]"
        );
        
        if (solanaWalletButton) {
          solanaWalletButton.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        }
      }
    }
  };

  // Create character
  const handleCreateCharacter = async () => {
    setIsCreating(true);
    setGenerationProgress("Preparing character data...");
    setGenerationError(null);

    try {
      let finalDescription = description;

      if (creationMethod === "lore") {
        finalDescription = convertLoreToDescription();
      }

      // Ensure we have a name
      if (!name.trim()) {
        throw new Error("Character name is required");
      }

      setGenerationProgress("Generating character...");

      try {
        // Show the generation progress component (overlay)
        setShowGenerationProgress(true);
        
        // Scroll to top to ensure overlay is visible
        window.scrollTo(0, 0);

        // Include NFT data if it's being used
        const payload = {
          description: finalDescription,
          name,
          // Add NFT data if available
          nft: useNft && selectedNft 
            ? {
                tokenAddress: selectedNft.tokenAddress || '',
                tokenId: selectedNft.tokenId || '',
                chain: selectedNft.chain,
                metadata: selectedNft.metadata,
                isNftBased: true
            }
            : null,
          // Add avatar URL if available
          ...(avatarUrl && { avatarUrl }),
          // Include selected lore if using the lore creation method
          ...(creationMethod === "lore" && selectedLore && { lore: selectedLore })
        };

        // Add debug info to the console about NFT data being sent
        if (useNft && selectedNft && selectedNft.metadata?.attributes) {
          console.log(`Sending character with NFT data. NFT has ${selectedNft.metadata.attributes.length} attributes.`);
        }

        // Create an AbortController for the API request (separate from the progress indicator)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 10 * 60 * 1000); // 10 minutes timeout (longer than the UI shows)
        
        const response = await api.post("/api/character/generate", payload, {
          signal: controller.signal,
          timeout: 10 * 60 * 1000, // 10 minutes in milliseconds
        });

        clearTimeout(timeoutId); // Clear the timeout if request completes successfully

        if (response.data && response.data.id) {
          // Store the character ID for later use with the progress component
          setGeneratingCharacterId(response.data.id);
          
          // Leave the progress component displaying - it will handle the redirect
          // Note: We're letting the progress component manage the UI experience 
          // and redirect, even if the actual API call finished faster
        } else {
          throw new Error("Failed to create character");
        }
      } catch (err: unknown) {
        console.error("Error creating character:", err);
        setShowGenerationProgress(false);
        
        const errorMessage =
          err instanceof Error
            ? err.name === "AbortError"
              ? "Character generation timed out. Please try again with a simpler description."
              : err.message
            : "Failed to create character. Please try again.";
        setGenerationError(errorMessage);
      } finally {
        setIsCreating(false);
        setGenerationProgress("");
      }
    } catch (err: unknown) {
      console.error("Error creating character:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create character. Please try again.";
      setGenerationError(errorMessage);
      setIsCreating(false);
      setShowGenerationProgress(false);
    }
  };

  // Handle completion of character generation
  const handleGenerationComplete = () => {
    // Reset form state on successful character creation
    resetFormState();
    
    // If onSuccess handler was provided, call it
    if (onSuccess && generatingCharacterId) {
      onSuccess(generatingCharacterId);
      return; // Let the onSuccess handler manage the redirect
    }
    
    // Redirect to character list if no specific handler
    router.push("/en/dashboard/plugins/characters");
  };

  // Load nft data from localstorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedNftData = localStorage.getItem(STORAGE_KEYS.nftData);
        if (savedNftData) {
          try {
            setNftData(JSON.parse(savedNftData));
          } catch (e) {
            console.error("Failed to parse saved NFT data:", e);
          }
        }
      }
    } catch (e) {
      console.error("Error loading saved NFT data:", e);
    }
  }, [STORAGE_KEYS.nftData]);

  // Save nft data to localstorage when it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.nftData, JSON.stringify(nftData));
      }
    } catch (e) {
      console.error("Error saving NFT data:", e);
    }
  }, [nftData, STORAGE_KEYS.nftData]);

  return (
    <>
      {/* Show generation progress component when character is being generated */}
      {showGenerationProgress ? (
        <CharacterGenerationProgress 
          onComplete={handleGenerationComplete}
          characterId={generatingCharacterId}
        />
      ) : (
        <div className="space-y-8">
          {/* Error Alerts */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <ExclamationCircleOutlined />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {generationError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <ExclamationCircleOutlined />
                <div>
                  <div className="font-medium">Character Generation Error</div>
                  <div className="text-sm">{generationError}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Left sidebar with basic info */}
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Basic Information</h2>
                  <p className="text-gray-400">
                    Set your character's identity
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Character Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Character Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter character name"
                      disabled={loading}
                      className="bg-[#2A2A2A] border-gray-700 text-white"
                    />
                  </div>

                  {/* NFT Connection Section */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-300">
                          NFT-Based Character
                        </div>
                        <div className="relative group">
                          <div className="cursor-help text-xs text-gray-400 bg-gray-700 rounded-full h-4 w-4 flex items-center justify-center">
                            ?
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                            Use one of your NFTs as the basis for your character.
                            The AI will extract traits and characteristics from your
                            NFT's metadata.
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isAnyWalletConnected ? (
                      <div
                        className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 group cursor-pointer hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-200"
                        onClick={handleConnectWalletClick}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-cyan-500/20 p-2 rounded-full">
                            <WalletOutlined className="text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              Connect Wallet
                            </p>
                            <p className="text-xs text-gray-400">
                              Link your NFTs to create a unique character
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <CharacterNFTSelector
                          onChange={handleNftChange}
                          initialUseNft={useNft}
                          initialNft={selectedNft}
                        />
                        
                        {/* NFT Traits Enhancement Notification */}
                        {useNft && selectedNft && selectedNft.metadata?.attributes && selectedNft.metadata.attributes.length > 0 && (
                          <div className="mt-3 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl">
                            <div className="text-sm">
                              <div className="font-medium">NFT Traits Detected</div>
                              <div className="text-xs mt-1 text-green-300">
                                {`Found ${selectedNft.metadata.attributes?.length ?? 0} traits in your NFT. 
                                These will be used to enhance your character's description and personality.`}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Warning for NFTs without traits */}
                        {useNft && selectedNft && (!selectedNft.metadata?.attributes || selectedNft.metadata.attributes.length === 0) && (
                          <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-xl">
                            <div className="text-sm">
                              <div className="font-medium">Limited NFT Metadata</div>
                              <div className="text-xs mt-1 text-yellow-300">
                                This NFT doesn't have detailed traits. For best results, provide a thorough description or select an NFT with richer metadata.
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Creation method selector */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="text-sm font-medium text-gray-300 mb-3">
                      Creation Method
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={classNames(
                          "flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-200 border",
                          creationMethod === "description"
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                            : "bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50 hover:border-gray-600"
                        )}
                        onClick={() => setCreationMethod("description")}
                      >
                        <FiStar size={20} className="mb-2" />
                        <span className="text-sm font-medium">Simple</span>
                      </div>
                      <div
                        className={classNames(
                          "flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-200 border",
                          creationMethod === "lore"
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                            : "bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50 hover:border-gray-600"
                        )}
                        onClick={() => setCreationMethod("lore")}
                      >
                        <FiBook size={20} className="mb-2" />
                        <span className="text-sm font-medium">Guided</span>
                      </div>
                    </div>
                  </div>

                  {/* Reset button and auto-save indicator */}
                  <div className="pt-4 border-t border-gray-700 space-y-2">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to reset all progress? This cannot be undone."
                          )
                        ) {
                          resetFormState();
                        }
                      }}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FiRotateCcw size={16} />
                      Reset Progress
                    </button>

                    {/* Auto-save indicator */}
                    <div className="flex items-center justify-center text-xs text-gray-400">
                      <FiSave size={14} className="mr-2 text-green-400" />
                      Progress saved automatically
                    </div>
                  </div>

                  {/* Create button for description method */}
                  {creationMethod === "description" && (
                    <button
                      onClick={handleCreateCharacter}
                      disabled={!name.trim() || !description.trim() || loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      )}
                      Create Character
                    </button>
                  )}
                </div>
              </div>

              {/* Generation progress */}
              {generationProgress && (
                <div className="bg-[#1A1A1A] rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400" />
                    <p className="text-sm text-gray-300">{generationProgress}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Main content area */}
            <div>
              {creationMethod === "description" ? (
                <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl h-full">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">Character Description</h2>
                    <p className="text-gray-400">
                      Describe your character in detail
                    </p>
                  </div>
                  <div>
                    <TextArea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your character's personality, background, appearance, and any other relevant details..."
                      className="min-h-[400px] bg-[#2A2A2A] border-gray-700 text-white resize-none"
                      disabled={loading}
                    />
                    <p className="text-sm text-gray-400 mt-3">
                      The more detailed your description, the better your character will be.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl h-full">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {selectedLore ? (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
                            onClick={() => {
                              setSelectedLore(null);
                              setAnswers({});
                              setCurrentPage(1);
                            }}
                          >
                            <FiArrowLeft size={16} />
                          </button>
                          <span>Guided Questionnaire</span>
                          {totalPages > 0 && (
                            <Badge
                              count={`${currentPage}/${totalPages}`}
                              className="bg-cyan-500"
                            />
                          )}
                        </div>
                      ) : (
                        "Choose Template"
                      )}
                    </h2>
                    <p className="text-gray-400">
                      {selectedLore
                        ? "Answer the questions to create your character"
                        : "Choose a template to start the guided creation process"}
                    </p>
                  </div>
                  <div>
                    {!selectedLore ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lores.map((lore) => (
                          <div
                            key={lore.id}
                            className="bg-gray-800/50 border border-gray-700 hover:border-cyan-500 hover:bg-gray-700/50 cursor-pointer transition-all duration-200 p-6 rounded-xl"
                            onClick={() => setSelectedLore(lore.id)}
                          >
                            <h3 className="text-lg font-semibold text-white mb-2">{lore.title}</h3>
                            {lore.description && (
                              <p className="text-gray-400 text-sm">{lore.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {loadingQuestions ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
                          </div>
                        ) : (
                          <>
                            {pageQuestions.map((question) => (
                              <div key={question.id} className="space-y-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-3">
                                    {question.question}
                                  </h3>
                                  {question.options ? (
                                    <div className="grid gap-3">
                                      {question.options.map((option, idx) => (
                                        <div
                                          key={idx}
                                          className={classNames(
                                            "p-4 border rounded-xl cursor-pointer transition-all duration-200",
                                            answers[question.id] === option.name
                                              ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                              : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50"
                                          )}
                                          onClick={() =>
                                            handleAnswerChange(question.id, option.name)
                                          }
                                        >
                                          <div className="font-medium">{option.name}</div>
                                          {option.description && (
                                            <p className="text-sm mt-1 opacity-80">
                                              {option.description}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <TextArea
                                      value={answers[question.id] || ""}
                                      onChange={(e) =>
                                        handleAnswerChange(question.id, e.target.value)
                                      }
                                      placeholder="Enter your answer..."
                                      className="bg-[#2A2A2A] border-gray-700 text-white"
                                      rows={4}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Navigation buttons for guided mode */}
                            <div className="flex justify-between pt-6 border-t border-gray-700">
                              <button
                                onClick={handlePrevPage}
                                disabled={currentPage <= 1}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>
                              
                              {currentPage < totalPages ? (
                                <button
                                  onClick={handleNextPage}
                                  disabled={!isCurrentPageComplete()}
                                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Next
                                </button>
                              ) : (
                                <button
                                  onClick={handleCreateCharacter}
                                  disabled={!isCharacterCreationReady() || loading}
                                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {loading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block" />
                                  )}
                                  Create Character
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
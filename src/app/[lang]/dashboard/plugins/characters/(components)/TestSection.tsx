import { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar } from "antd";
import { testCharacter } from "@/lib/character";
import { 
  SendOutlined, 
  LoadingOutlined, 
  StarOutlined, 
  SmileOutlined,
  UserOutlined
} from "@ant-design/icons";

const { TextArea } = Input;

interface TestSectionProps {
  characterId?: string;
  characterName?: string;
  characterAvatar?: string;
  showTimestamps?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "character";
  timestamp: Date;
}

// Define the expected response structure
interface CharacterResponse {
  response?: string;
  text?: string;
}

export function TestSection({ 
  characterId, 
  characterName = "Character", 
  characterAvatar,
  showTimestamps = false 
}: TestSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the end of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleTestMessage = async () => {
    if (!newMessage.trim() || !characterId) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    setError(null);
    
    try {
      // Send message to character
      const response = await testCharacter(characterId, newMessage);
      
      // Safely extract the response text using type assertion and optional chaining
      const characterResponse = response as unknown as CharacterResponse;
      const responseText = characterResponse?.text || characterResponse?.response || "No response received";
      
      // Create character message
      const characterMessage: Message = {
        id: `char-${Date.now()}`,
        content: responseText,
        sender: "character",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, characterMessage]);
    } catch (err) {
      console.error("Error testing character:", err);
      setError("Error communicating with character. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTestMessage();
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden border border-[#2f2f34] rounded-md">
      {/* Messages Container */}
      <div 
        className="flex-1 p-4 overflow-y-auto"
        style={{ 
          backgroundColor: "var(--color-dark)",
          maxHeight: "400px",
        }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <SmileOutlined style={{ fontSize: "28px", opacity: 0.5, marginBottom: "8px" }} />
              <p style={{ color: "var(--text-secondary)" }}>
                Send a message to test your character.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-[var(--color-secondary)] text-white"
                      : "bg-[var(--color-gray)] text-white"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "character" && (
                      <div className="min-w-[32px] flex-shrink-0">
                        <Avatar 
                          src={characterAvatar} 
                          icon={!characterAvatar && <UserOutlined />}
                          size={32} 
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {message.sender === "character" && (
                        <div className="font-medium">{characterName}</div>
                      )}
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      {showTimestamps && (
                        <div 
                          className="text-xs opacity-70 mt-1"
                          style={{ textAlign: message.sender === "user" ? "right" : "left" }}
                        >
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                    </div>
                    {message.sender === "user" && (
                      <div className="min-w-[32px] flex-shrink-0">
                        <Avatar 
                          icon={<UserOutlined />}
                          size={32} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 text-red-500 text-sm bg-red-500/10">
          {error}
        </div>
      )}
      
      {/* Input Area */}
      <div className="p-3 border-t border-[#2f2f34] bg-[var(--color-dark)]">
        <div className="flex gap-2">
          <TextArea
            placeholder="Type a message to test your character..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading || !characterId}
            className="bg-[var(--color-gray)] border-[var(--color-gray)]"
          />
          <Button
            type="primary"
            icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
            onClick={handleTestMessage}
            disabled={!newMessage.trim() || isLoading || !characterId}
            className={isLoading ? "opacity-70" : ""}
          />
        </div>
        
        {!characterId && (
          <div className="mt-2 text-sm text-yellow-500">
            <StarOutlined className="mr-1" />
            Save your character first to enable testing.
          </div>
        )}
      </div>
    </div>
  );
} 
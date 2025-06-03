'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Typography } from "antd";
import ChatMessage, { Message } from './ChatMessage';

const { Text } = Typography;

// WebSocket event data interface
interface WebSocketEventData {
  type: string;
  payload: Record<string, unknown>;
}

// Singleton WebSocket manager specifically for read-only overlay
class WebSocketManager {
  private static instance: WebSocketManager;
  private connections: Map<string, WebSocket> = new Map();
  private messageCallbacks: Map<string, Set<(data: WebSocketEventData) => void>> = new Map();
  private closeCallbacks: Map<string, Set<(event: CloseEvent) => void>> = new Map();
  private pingInterval: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public connect(roomId: string): WebSocket | null {
    if (this.connections.has(roomId)) {
      const ws = this.connections.get(roomId);
      const readyState = ws?.readyState;
      
      // If open, just return the connection
      if (readyState === WebSocket.OPEN && ws) {
        return ws;
      }
      // If connecting, return the connecting socket
      else if (readyState === WebSocket.CONNECTING && ws) {
        return ws;
      }
      // If closing or closed, remove it so we can create a new one
      else if (readyState === WebSocket.CLOSING || readyState === WebSocket.CLOSED) {
        this.connections.delete(roomId);
        this.clearCallbacks(roomId);
      }
    }

    // Create new connection
    try {
      const wsUrl = `wss://chat.avie.live/chat/${roomId}`;
      const ws = new WebSocket(wsUrl, ['chat']);
      
      this.connections.set(roomId, ws);
      
      // Setup event handlers
      ws.onopen = () => {
        // Setup ping interval to keep connection alive
        if (this.pingInterval.has(roomId)) {
          clearInterval(this.pingInterval.get(roomId));
        }
        
        this.pingInterval.set(roomId, setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping', payload: { timestamp: Date.now() } }));
          }
        }, 30000)); // Send ping every 30 seconds
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketEventData;
          
          // Notify all callbacks
          this.messageCallbacks.get(roomId)?.forEach(callback => callback(data));
        } catch (error) {
          console.error(`[OverlayWSManager] Error parsing message:`, error);
        }
      };
      
      ws.onclose = (event) => {
        // Clear ping interval
        if (this.pingInterval.has(roomId)) {
          clearInterval(this.pingInterval.get(roomId));
          this.pingInterval.delete(roomId);
        }
        
        // Notify all callbacks
        this.closeCallbacks.get(roomId)?.forEach(callback => callback(event));
        
        // Remove connection
        this.connections.delete(roomId);
      };
      
      return ws;
    } catch (error) {
      console.error(`[OverlayWSManager] Error creating connection:`, error);
      return null;
    }
  }

  public disconnect(roomId: string): void {
    if (this.connections.has(roomId)) {
      // Clear ping interval
      if (this.pingInterval.has(roomId)) {
        clearInterval(this.pingInterval.get(roomId));
        this.pingInterval.delete(roomId);
      }
      
      // Close connection
      const ws = this.connections.get(roomId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      
      // Remove connection
      this.connections.delete(roomId);
      
      // Clear callbacks
      this.clearCallbacks(roomId);
    }
  }

  public onMessage(roomId: string, callback: (data: WebSocketEventData) => void): () => void {
    if (!this.messageCallbacks.has(roomId)) {
      this.messageCallbacks.set(roomId, new Set());
    }
    this.messageCallbacks.get(roomId)?.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.messageCallbacks.get(roomId)?.delete(callback);
    };
  }

  public onClose(roomId: string, callback: (event: CloseEvent) => void): () => void {
    if (!this.closeCallbacks.has(roomId)) {
      this.closeCallbacks.set(roomId, new Set());
    }
    this.closeCallbacks.get(roomId)?.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.closeCallbacks.get(roomId)?.delete(callback);
    };
  }

  private clearCallbacks(roomId: string): void {
    this.messageCallbacks.delete(roomId);
    this.closeCallbacks.delete(roomId);
  }

  public disconnectAll(): void {
    const roomIds = Array.from(this.connections.keys());
    for (const roomId of roomIds) {
      this.disconnect(roomId);
    }
  }
}

// Message payload interface
interface ChatMessagePayload {
  id: string;
  displayName?: string;
  username?: string;
  userId?: string;
  content?: string;
  message?: string;
  timestamp: number;
  avatarUrl?: string;
  metadata?: Record<string, any>;
  type?: string;
  platform?: string;
}

interface ChatOverlayProps {
  username: string; // streamer's username
  maxMessages?: number; // Optional: maximum number of messages to display
  fadeTime?: number; // Optional: time in ms before messages start to fade
  messageDuration?: number; // Optional: time in ms that messages should remain visible
}

export function ChatOverlay({ 
  username, 
  maxMessages = 30, 
  fadeTime = 60000, // 60 seconds
  messageDuration = 300000 // 5 minutes
}: ChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesToShow, setMessagesToShow] = useState<(Message & { opacity: number })[]>([]);
  const wsManager = useRef<WebSocketManager>(WebSocketManager.getInstance());
  const processedMessages = useRef(new Set<string>());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const componentMountedRef = useRef(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // For cleaning old messages
  const messageTimestamps = useRef<Map<string, number>>(new Map());
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Effect to update message opacities and remove old messages
  useEffect(() => {
    // Function to update visible messages with proper opacity
    const updateVisibleMessages = () => {
      if (!componentMountedRef.current) return;
      
      const now = Date.now();
      const updatedMessages: (Message & { opacity: number })[] = [];
      
      // Process messages and update their opacities
      messages.forEach(message => {
        const messageTime = messageTimestamps.current.get(message.id || '') || 0;
        const age = now - messageTime;
        
        // If the message is older than messageDuration, don't add it to visible messages
        if (age >= messageDuration) {
          return;
        }
        
        // Calculate opacity based on age
        let opacity = 1;
        if (age > fadeTime) {
          const fadePercentage = Math.min(1, (age - fadeTime) / (messageDuration - fadeTime));
          opacity = 1 - fadePercentage;
          
          // If opacity is nearly 0, don't render the message anymore
          if (opacity < 0.05) {
            return;
          }
        }
        
        // Add message with its calculated opacity
        updatedMessages.push({
          ...message,
          opacity
        });
      });
      
      setMessagesToShow(updatedMessages);
      
      // Schedule next animation frame
      animationFrameRef.current = requestAnimationFrame(updateVisibleMessages);
    };
    
    // Start the update loop
    updateVisibleMessages();
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [messages, fadeTime, messageDuration]);

  // Cleanup function
  useEffect(() => {
    componentMountedRef.current = true;
    
    // Setup message cleanup interval to remove expired messages from the main array
    cleanupIntervalRef.current = setInterval(() => {
      if (messages.length > 0) {
        const now = Date.now();
        // Remove messages older than messageDuration from the main messages array
        setMessages(prev => prev.filter(msg => {
          const messageTime = messageTimestamps.current.get(msg.id || '');
          if (!messageTime) return true; // Keep if we don't know when it arrived
          return now - messageTime < messageDuration;
        }));
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      // Set flag to prevent state updates after unmount
      componentMountedRef.current = false;
      
      // Clear any pending reconnect timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Clear message cleanup interval
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
        cleanupIntervalRef.current = null;
      }
      
      // Clear animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [messageDuration]);

  // Setup WebSocket connection
  useEffect(() => {
    // Connect as guest (no token needed)
    const ws = wsManager.current.connect(username);
    
    // Setup message handler
    const messageUnsubscribe = wsManager.current.onMessage(username, (data) => {
      if (!componentMountedRef.current) return;
      
      try {
        // Create a unique key for this message
        let messageKey: string;
        
        if (data.type === 'message' && data.payload && typeof data.payload.id === 'string') {
          // Use the message ID as the key if available
          messageKey = data.payload.id as string;
        } else {
          // Otherwise create a key from the stringified data
          messageKey = JSON.stringify(data);
        }
        
        if (processedMessages.current.has(messageKey)) {
          return;
        }
        
        processedMessages.current.add(messageKey);
        
        // Handle different message types from the chat server
        if (data.type === 'history') {
          if (data.payload && Array.isArray(data.payload)) {
            // Map messages and add IDs for tracking
            const historyMessages = (data.payload as unknown as ChatMessagePayload[]).map((msg) => {
              const id = msg.id;
              messageTimestamps.current.set(id, Date.now());
              
              return {
                id,
                username: msg.displayName || msg.username || msg.userId || 'anonymous',
                message: msg.content || msg.message || '',
                timestamp: new Date(msg.timestamp),
                avatarUrl: msg.avatarUrl,
                platform: msg.platform
              };
            });
            
            setMessages(historyMessages.slice(-maxMessages));
          }
        } else if (data.type === 'message') {
          if (data.payload) {
            // Convert payload to appropriate type using unknown
            const msgPayload = data.payload as unknown as ChatMessagePayload;
            const id = msgPayload.id;
            
            // Track when we received this message
            messageTimestamps.current.set(id, Date.now());
            
            const message = {
              id,
              username: msgPayload.displayName || msgPayload.username || msgPayload.userId || 'anonymous',
              message: msgPayload.content || msgPayload.message || '',
              timestamp: new Date(msgPayload.timestamp || Date.now()),
              avatarUrl: msgPayload.avatarUrl,
              // Add these properties to identify special messages
              isSystem: msgPayload.metadata?.system === true,
              messageType: msgPayload.type || 'text',
              messageClass: msgPayload.metadata?.messageClass,
              isHighlighted: msgPayload.metadata?.isHighlighted === true,
              metadata: msgPayload.metadata,
              platform: msgPayload.platform
            };
            
            setMessages(prev => {
              // Check if message with this ID already exists
              if (prev.some(m => m.id === message.id)) {
                return prev;
              }
              
              // Limit number of messages
              const newMessages = [...prev, message];
              if (newMessages.length > maxMessages) {
                return newMessages.slice(-maxMessages);
              }
              return newMessages;
            });
          }
        }
      } catch (error) {
        console.error('[ChatOverlay] Error processing message:', error);
      }
    });
    
    const closeUnsubscribe = wsManager.current.onClose(username, () => {
      if (!componentMountedRef.current) return;
      
      if (componentMountedRef.current) {
        // Clear any previous reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        // Try to reconnect after a short delay
        reconnectTimeoutRef.current = setTimeout(() => {
          if (componentMountedRef.current) {
            wsManager.current.connect(username);
          }
        }, 2000);
      }
    });
    
    // Return cleanup function
    return () => {
      messageUnsubscribe();
      closeUnsubscribe();
    };
  }, [username, maxMessages]);

  // Add scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesToShow]);

  return (
    <div 
      className="flex flex-col h-screen w-full overflow-hidden"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '8px'
      }}
    >
      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="overlay-messages-container flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ 
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none' /* IE and Edge */
        }}
      >
        {messagesToShow.map((message, index) => (
          <div 
            key={message.id || index} 
            className="mb-2"
            style={{ 
              opacity: message.opacity, 
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <ChatMessage 
              message={message} 
              onEmojiClick={() => {}} // No emoji click functionality in overlay
              currentUserId={undefined} // No current user in overlay mode
            />
          </div>
        ))}
      </div>
    </div>
  );
} 
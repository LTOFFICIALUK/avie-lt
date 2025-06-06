'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  SendOutlined, 
  LoginOutlined, 
  SmileOutlined,
  StopOutlined
} from '@ant-design/icons';
import { getToken } from '@/lib/auth';
import { Button, Input, Typography } from "antd";
import dynamic from 'next/dynamic';
import { Theme } from 'emoji-picker-react';
import ChatMessage, { Message } from './ChatMessage';

const { Text } = Typography;
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { 
  ssr: false,
  loading: () => null
});

// Definiramo tipe za WebSocket sporočila
interface WebSocketEventData {
  type: string;
  payload: Record<string, unknown>;
}

// Singleton WebSocket manager
// To prevent multiple connections in development mode or when component remounts
class WebSocketManager {
  private static instance: WebSocketManager;
  private connections: Map<string, WebSocket> = new Map();
  private connectionCallbacks: Map<string, Set<(event: Event) => void>> = new Map();
  private messageCallbacks: Map<string, Set<(data: WebSocketEventData) => void>> = new Map();
  private closeCallbacks: Map<string, Set<(event: CloseEvent) => void>> = new Map();
  private errorCallbacks: Map<string, Set<(event: Event) => void>> = new Map();
  private pingInterval: Map<string, NodeJS.Timeout> = new Map();
  private authTokens: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public connect(roomId: string, token?: string): WebSocket | null {
    if (token) {
      this.authTokens.set(roomId, token);
    }
    
    if (this.connections.has(roomId)) {
      const ws = this.connections.get(roomId);
      const existingToken = this.authTokens.get(roomId);
      const readyState = ws?.readyState;
      

      if (token && existingToken !== token) {
        this.disconnect(roomId);
      } 
      // If open, just return the connection (authentication will be handled separately)
      else if (readyState === WebSocket.OPEN && ws) {
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
      ws.onopen = (event) => {
        
        // Send authentication if token is provided
        if (token || this.authTokens.get(roomId)) {
          const authToken = token || this.authTokens.get(roomId);
          ws.send(JSON.stringify({
            type: 'authenticate',
            payload: {
              token: authToken
            }
          }));
        }
        
        // Setup ping interval to keep connection alive
        if (this.pingInterval.has(roomId)) {
          clearInterval(this.pingInterval.get(roomId));
        }
        
        this.pingInterval.set(roomId, setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping', payload: { timestamp: Date.now() } }));
          }
        }, 30000)); // Send ping every 30 seconds
        
        // Notify all callbacks
        this.connectionCallbacks.get(roomId)?.forEach(callback => callback(event));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketEventData;
          
          // Notify all callbacks
          this.messageCallbacks.get(roomId)?.forEach(callback => callback(data));
        } catch (error) {
          console.error(`[WebSocketManager] Error parsing message:`, error);
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
      
      ws.onerror = (event) => {
        console.error(`[WebSocketManager] Connection error for room ${roomId}:`, event);
        
        // Notify all callbacks
        this.errorCallbacks.get(roomId)?.forEach(callback => callback(event));
      };
      
      return ws;
    } catch (error) {
      console.error(`[WebSocketManager] Error creating connection:`, error);
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
      
      // Clear authentication token
      this.authTokens.delete(roomId);
      
      // Clear callbacks
      this.clearCallbacks(roomId);
    }
  }

  public send(roomId: string, type: string, payload: Record<string, unknown>): boolean {
    if (this.connections.has(roomId) && this.connections.get(roomId)?.readyState === WebSocket.OPEN) {
      this.connections.get(roomId)?.send(JSON.stringify({ type, payload }));
      return true;
    }
    return false;
  }

  public onConnect(roomId: string, callback: (event: Event) => void): () => void {
    if (!this.connectionCallbacks.has(roomId)) {
      this.connectionCallbacks.set(roomId, new Set());
    }
    this.connectionCallbacks.get(roomId)?.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.connectionCallbacks.get(roomId)?.delete(callback);
    };
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

  public onError(roomId: string, callback: (event: Event) => void): () => void {
    if (!this.errorCallbacks.has(roomId)) {
      this.errorCallbacks.set(roomId, new Set());
    }
    this.errorCallbacks.get(roomId)?.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.errorCallbacks.get(roomId)?.delete(callback);
    };
  }

  private clearCallbacks(roomId: string): void {
    this.connectionCallbacks.delete(roomId);
    this.messageCallbacks.delete(roomId);
    this.closeCallbacks.delete(roomId);
    this.errorCallbacks.delete(roomId);
  }

  public disconnectAll(): void {
    // Pretvorimo ključe Map-a v array, da se izognemo linter napaki
    const roomIds = Array.from(this.connections.keys());
    for (const roomId of roomIds) {
      this.disconnect(roomId);
    }
  }

  // Re-send authentication for an existing connection
  public authenticate(roomId: string, token: string): boolean {
    this.authTokens.set(roomId, token);
    
    if (this.connections.has(roomId) && this.connections.get(roomId)?.readyState === WebSocket.OPEN) {
      this.connections.get(roomId)?.send(JSON.stringify({
        type: 'authenticate',
        payload: {
          token: token
        }
      }));
      return true;
    }
    return false;
  }

  public isAuthenticated(roomId: string): boolean {
    return this.authTokens.has(roomId);
  }
}

// Definiramo tip za sporočilo iz strežnika
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

interface ChatBoxProps {
  username: string; // streamer's username
}

// Define constants for message limits
const MAX_MESSAGE_LENGTH = 200; // Maximum characters per message
const MAX_MESSAGES_BEFORE_COOLDOWN = 10; // Number of messages before cooldown
const COOLDOWN_PERIOD = 30000; // Cooldown period in milliseconds (30 seconds)
const MESSAGES_TIMEFRAME = 60000; // Timeframe to count messages (60 seconds)

export function Chat({ username }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // New state variables for spam prevention
  const [inCooldown, setInCooldown] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [messageLengthError, setMessageLengthError] = useState(false);
  const wsManager = useRef<WebSocketManager>(WebSocketManager.getInstance());
  const processedMessages = useRef(new Set<string>());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const componentMountedRef = useRef(true);
  const tokenRef = useRef<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Ref to keep track of user messages
  const userMessageTimestamps = useRef<number[]>([]);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Force UI update when connection state changes
  const forceUpdate = useRef<NodeJS.Timeout | null>(null);

  // Check auth status on mount and when auth changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken();
      const previousToken = tokenRef.current;
      tokenRef.current = token;
      
      if (token) {
        // Don't set authenticated immediately, let the server confirm it
        setError(null);
        
        // If token changed or we didn't have one before, handle reconnection/authentication
        if (token !== previousToken) {
          
          if (isConnected) {
            // If already connected, try to re-authenticate instead of full reconnect
            if (wsManager.current.authenticate(username, token)) {
              
              // Schedule a state check in case we don't get an auth confirmation
              if (forceUpdate.current) {
                clearTimeout(forceUpdate.current);
              }
              forceUpdate.current = setTimeout(() => {
                if (componentMountedRef.current && !isAuthenticated && wsManager.current.isAuthenticated(username)) {
                  setIsAuthenticated(true);
                }
              }, 2000);
            } else {
              // If re-authentication failed (connection not open), reconnect
              wsManager.current.disconnect(username);
              setTimeout(() => {
                if (componentMountedRef.current) {
                  wsManager.current.connect(username, token);
                }
              }, 500);
            }
          }
        } else if (!isAuthenticated && wsManager.current.isAuthenticated(username)) {
          // If we have a token and connection exists but UI doesn't show authenticated
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        setError('You need to be logged in to chat');
      }
    };
    
    // Check auth status immediately
    checkAuthStatus();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'jwt_token') {
        handleAuthChange();
      }
    });
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [username, isConnected, isAuthenticated]);

  // Cleanup function
  useEffect(() => {
    componentMountedRef.current = true;
    
    return () => {
      // Set flag to prevent state updates after unmount
      componentMountedRef.current = false;
      
      // Clear any pending reconnect timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    // Get JWT token
    const token = tokenRef.current || getToken();
    if (!token) {
      setIsAuthenticated(false);
      setError('You need to be logged in to chat');
      return;
    }

    
    const ws = wsManager.current.connect(username, token);
    
    if (ws && ws.readyState === WebSocket.OPEN) {

      wsManager.current.authenticate(username, token);
      
      if (wsManager.current.isAuthenticated(username) && !isAuthenticated) {
        setIsAuthenticated(true);
      }
      
      if (!isConnected) {
        setIsConnected(true);
      }
    } else if (ws && ws.readyState === WebSocket.CONNECTING) {
    }
    
    // Setup event handlers
    const connectUnsubscribe = wsManager.current.onConnect(username, () => {
      if (!componentMountedRef.current) return;
      
      setIsConnected(true);
      setError(null);
      
      // When connecting, immediately check if we should authenticate
      const authToken = tokenRef.current || getToken();
      if (authToken && !isAuthenticated) {
        wsManager.current.authenticate(username, authToken);
      }
    });
    
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
        if (data.type === 'authenticate') {
          if (data.payload && data.payload.success) {
            // Cancel any pending force updates
            if (forceUpdate.current) {
              clearTimeout(forceUpdate.current);
              forceUpdate.current = null;
            }
            setIsAuthenticated(true);
            setError(null);
          } else if (data.payload && !data.payload.success) {
            setIsAuthenticated(false);
            setError('Authentication failed. Please try logging in again.');
            
            // Try to get a fresh token
            const freshToken = getToken();
            if (freshToken && freshToken !== tokenRef.current) {
              tokenRef.current = freshToken;
              wsManager.current.authenticate(username, freshToken);
            }
          }
        } else if (data.type === 'connect' || data.type === 'connection_established') {
          
          if (!isAuthenticated) {
            const token = tokenRef.current || getToken();
            if (token) {
              wsManager.current.authenticate(username, token);
              
              // Schedule a force update in case we don't get an auth confirmation
              if (forceUpdate.current) {
                clearTimeout(forceUpdate.current);
              }
              forceUpdate.current = setTimeout(() => {
                if (componentMountedRef.current && !isAuthenticated) {
                  setIsAuthenticated(true);
                }
              }, 2000);
            }
          }
        } else if (data.type === 'history') {
          if (data.payload && data.payload.messages && Array.isArray(data.payload.messages)) {
            
            // Map messages and add IDs for tracking
            const historyMessages = (data.payload.messages as unknown as ChatMessagePayload[]).map((msg) => ({
              id: msg.id,
              username: msg.displayName || msg.username || msg.userId || 'anonymous',
              message: msg.content || msg.message || '',
              timestamp: new Date(msg.timestamp),
              avatarUrl: msg.avatarUrl,
              userId: msg.userId,
              // Add these properties to keep consistent with regular messages
              isSystem: msg.metadata?.system === true,
              messageType: msg.type || 'text',
              messageClass: msg.metadata?.messageClass,
              isHighlighted: msg.metadata?.isHighlighted === true,
              metadata: msg.metadata,
              platform: msg.platform
            }));
            
            setMessages(historyMessages);
          }
        } else if (data.type === 'message') {
          if (data.payload) {
            // Pretvorimo payload v ustrezen tip s pomočjo unknown
            const msgPayload = data.payload as unknown as ChatMessagePayload;
            const message = {
              id: msgPayload.id,
              username: msgPayload.displayName || msgPayload.username || msgPayload.userId || 'anonymous',
              message: msgPayload.content || msgPayload.message || '',
              timestamp: new Date(msgPayload.timestamp || Date.now()),
              avatarUrl: msgPayload.avatarUrl,
              userId: msgPayload.userId,
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
              return [...prev, message];
            });
          }
        } else if (data.type === 'error') {
          console.error('[ChatBox] Server error:', data.payload);
          setError((data.payload?.message as string) || 'An error occurred');
        }
      } catch (error) {
        console.error('[ChatBox] Error processing message:', error);
      }
    });
    
    const closeUnsubscribe = wsManager.current.onClose(username, () => {
      if (!componentMountedRef.current) return;
      
      setIsConnected(false);
      
      if (componentMountedRef.current) {
        
        // Clear any previous reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (componentMountedRef.current) {
            const freshToken = getToken();
            
            if (freshToken) {
              tokenRef.current = freshToken;
              wsManager.current.connect(username, freshToken);
            }
          }
        }, 2000); // Shorter retry delay for better UX
      }
    });
    
    const errorUnsubscribe = wsManager.current.onError(username, () => {
      if (!componentMountedRef.current) return;
      
      console.error('[ChatBox] WebSocket error');

      if (isConnected) {
        setIsConnected(false);
      }
    });
    
    // Return cleanup function
    return () => {
      connectUnsubscribe();
      messageUnsubscribe();
      closeUnsubscribe();
      errorUnsubscribe();
      
      if (forceUpdate.current) {
        clearTimeout(forceUpdate.current);
        forceUpdate.current = null;
      }
    };
  }, [username, isAuthenticated, isConnected]);

  // Add scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Add effect for updating cooldown timer
  useEffect(() => {
    if (inCooldown && cooldownRemaining > 0) {
      const interval = setInterval(() => {
        setCooldownRemaining(prev => {
          const newValue = prev - 1000;
          if (newValue <= 0) {
            clearInterval(interval);
            setInCooldown(false);
            return 0;
          }
          return newValue;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [inCooldown, cooldownRemaining]);

  // Clean up any cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    
    // Check if the message is empty or if user is not connected or authenticated
    if (!trimmedMessage || !isConnected || !isAuthenticated) return;
    
    // Check message length
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setMessageLengthError(true);
      setTimeout(() => setMessageLengthError(false), 3000); // Show error for 3 seconds
      return;
    }
    
    // Check for spam cooldown
    if (inCooldown) {
      return;
    }
    
    // Add current timestamp to the messages array
    const now = Date.now();
    userMessageTimestamps.current.push(now);
    
    // Clean up old timestamps (older than the timeframe)
    userMessageTimestamps.current = userMessageTimestamps.current.filter(
      timestamp => now - timestamp < MESSAGES_TIMEFRAME
    );
    
    // Check if user has sent too many messages in the timeframe
    if (userMessageTimestamps.current.length >= MAX_MESSAGES_BEFORE_COOLDOWN) {
      setInCooldown(true);
      setCooldownRemaining(COOLDOWN_PERIOD);
      
      // Clear messages after cooldown period
      cooldownTimerRef.current = setTimeout(() => {
        if (componentMountedRef.current) {
          setInCooldown(false);
          userMessageTimestamps.current = [];
        }
      }, COOLDOWN_PERIOD);
      
      // Add system message to inform the user
      setMessages(prev => [
        ...prev, 
        {
          username: "System",
          message: `You've been sending messages too quickly. Please wait ${COOLDOWN_PERIOD/1000} seconds before sending another message.`,
          timestamp: new Date(),
          isSystem: true,
          messageType: 'system',
        }
      ]);
      
      return;
    }

    // Send the message if all checks pass
    wsManager.current.send(username, 'message', {
      content: trimmedMessage
    });

    setNewMessage('');
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Dodamo ref za zapiranje emoji pickerja ob kliku zunaj
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean up any pending timers on unmount
  useEffect(() => {
    return () => {
      if (forceUpdate.current) {
        clearTimeout(forceUpdate.current);
        forceUpdate.current = null;
      }
    };
  }, []);

  // Instead of blocking the entire chat UI with an error, we'll just show the messages
  // and disable the input with an appropriate message for banned users
  const isBanned = error && error.includes('banned');
  const banMessage = isBanned ? error : null;
  const displayError = error && !isBanned ? error : null;

  if (displayError) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-red-500">{displayError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-2 shadow-2xl border-[rgba(255,255,255,0.25)] w-full rounded-xl overflow-hidden">
      {/* Chat Header */}
      <div className="py-3 px-4 border-b-2 border-[rgba(255,255,255,0.2)]" style={{ flexShrink: 0 }}>
        <div className="flex items-center justify-center">
          <h3 className="text-lg font-semibold text-white">Welcome To {username}'s Live Chat</h3>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent" 
        style={{ 
          flex: '1 1 auto', 
          overflowY: 'auto',
          height: '0px',
          minHeight: '0px',
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id || index} 
            message={message} 
            onEmojiClick={(emoji) => setNewMessage(prev => prev + emoji)}
            currentUserId={tokenRef.current ? JSON.parse(atob(tokenRef.current.split('.')[1])).userId : null}
          />
        ))}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-8 opacity-70">
            <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
              No messages yet. Be the first to say hello!
            </Text>
          </div>
        )}
      </div>

      {/* Ban notification */}
      {banMessage && (
        <div className="px-4 py-2 bg-red-500/20 border-t-2 border-red-500/40">
          <Text style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', display: 'block' }}>
            <StopOutlined style={{ marginRight: '8px' }} />
            You are banned from chatting in this room
          </Text>
        </div>
      )}

      {/* Message Input */}
      <div className="px-4 pt-2 pb-3 border-t-2 border-[rgba(255,255,255,0.2)]" style={{ flexShrink: 0 }}>
        <form onSubmit={handleSendMessage}>
          <div className="flex gap-2 relative">
            <Input
              type="text"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewMessage(e.target.value);
                if (e.target.value.length > MAX_MESSAGE_LENGTH) {
                  setMessageLengthError(true);
                } else {
                  setMessageLengthError(false);
                }
              }}
              placeholder={
                !isAuthenticated 
                  ? "Please log in to chat" 
                  : !isConnected 
                    ? "Connecting..." 
                    : banMessage
                      ? "You are banned from sending messages"
                    : inCooldown 
                      ? `Cooldown: ${Math.ceil(cooldownRemaining / 1000)}s remaining` 
                      : `Send a message (max ${MAX_MESSAGE_LENGTH} chars)...`
              }
              disabled={!isConnected || !isAuthenticated || inCooldown || !!banMessage}
              style={{ 
                height: '40px', 
                borderRadius: '20px',
                backgroundColor: 'rgba(45,45,45,0.4)',
                borderColor: messageLengthError ? 'rgba(255,0,0,0.7)' : banMessage ? 'rgba(255,0,0,0.5)' : 'rgba(255,255,255,0.3)',
                color: '#fff',
              }}
              prefix={
                <SmileOutlined 
                  onClick={() => isAuthenticated && isConnected && !inCooldown && !banMessage && setShowEmojiPicker(!showEmojiPicker)} 
                  style={{ 
                    color: isAuthenticated && isConnected && !inCooldown && !banMessage ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                    cursor: isAuthenticated && isConnected && !inCooldown && !banMessage ? 'pointer' : 'not-allowed',
                    fontSize: '16px'
                  }} 
                />
              }
              suffix={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Character count inside the input */}
                  {newMessage.length > 0 && !messageLengthError && (
                    <span className="text-xs text-gray-400 mr-2">
                      {newMessage.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  )}
                  {isAuthenticated ? (
                    <SendOutlined
                      onClick={handleSendMessage}
                      style={{ 
                        color: isConnected && newMessage.trim() && !inCooldown && !banMessage ? '#06b6d4' : 'rgba(255,255,255,0.3)',
                        cursor: isConnected && newMessage.trim() && !inCooldown && !banMessage ? 'pointer' : 'not-allowed',
                        fontSize: '16px'
                      }}
                    />
                  ) : (
                    <LoginOutlined
                      onClick={() => window.location.href = '/'}
                      style={{ color: '#fff', cursor: 'pointer', fontSize: '16px' }}
                    />
                  )}
                </div>
              }
            />

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2 z-50">
                <div className="border-2 border-[rgba(255,255,255,0.3)] rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: 'rgba(25,25,25,0.95)' }}>
                  <EmojiPicker
                    width={300}
                    height={400}
                    theme={Theme.DARK}
                    skinTonesDisabled
                    searchDisabled={false}
                    lazyLoadEmojis
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Message length and cooldown indicators */}
          <div style={{ minHeight: messageLengthError || inCooldown ? "20px" : "0px" }}>
            {messageLengthError && (
              <div className="mt-1 text-red-500 text-xs">
                Message too long! Maximum {MAX_MESSAGE_LENGTH} characters allowed.
              </div>
            )}
            
            {inCooldown && (
              <div className="mt-1 text-yellow-500 text-xs">
                Cooldown active. You can send messages again in {Math.ceil(cooldownRemaining / 1000)} seconds.
              </div>
            )}
          </div>
          
          {!isAuthenticated && !banMessage && (
            <div className="mt-2 flex justify-center">
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={() => window.location.href = '/'}
                style={{ 
                  height: '36px', 
                  borderRadius: '20px',
                  padding: '0 16px',
                }}
              >
                Login to Chat
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 
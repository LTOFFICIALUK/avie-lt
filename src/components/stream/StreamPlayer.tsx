'use client';

// Razširitev za HTMLVideoElement za iOS podporo
declare global {
  interface HTMLVideoElement {
    webkitEnterFullscreen?: () => void;
    webkitExitFullscreen?: () => void;
  }
}

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { getToken } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { 
  PlayCircleOutlined, PauseCircleOutlined, SoundOutlined, StopOutlined,
  FullscreenOutlined, FullscreenExitOutlined, BackwardOutlined, 
  ForwardOutlined, ClockCircleOutlined, UserOutlined
} from '@ant-design/icons';
import { Button, Slider } from 'antd';

interface StreamPlayerProps {
  username: string;
}

interface WatchStats {
  watchTimeSeconds: number;
  isWatchToEarnEnabled: boolean;
}

export function StreamPlayer({ username }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intentionallyPaused = useRef(false);
  const playStateRef = useRef(false);
  const connectionIdRef = useRef<string>('');
  const [error, setError] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [watchStats, setWatchStats] = useState<WatchStats>({
    watchTimeSeconds: 0,
    isWatchToEarnEnabled: false
  });
  const [isLive] = useState(true);
  const [isAtLiveEdge, setIsAtLiveEdge] = useState(true);
  const [isDraggingTime, setIsDraggingTime] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const STREAM_SERVER_URL = process.env.NEXT_PUBLIC_STREAM_URL || 'https://stream.avie.live';
  const API_WS_URL = `wss://backend.avie.live/stats/${username}`;

  // Add timeout ref for controls hide
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to HH:MM:SS
  const formatWatchTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  // Format viewer count (add K for thousands)
  const formatViewerCount = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (isLive) {
        setCurrentTime(video.duration - 1 || 0);
        setDuration(video.duration || 0);
        setIsAtLiveEdge(true);
      } else {
        setCurrentTime(video.currentTime);
        setDuration(video.duration);
        const isNearEnd = video.currentTime >= video.duration - 2;
        setIsAtLiveEdge(isNearEnd);
      }
    }
  }, [isLive]);

  const handleVolumeChange = useCallback((value: number) => {
    const newVolume = value;
    
    // Update state first
    setVolume(newVolume);
    
    // Then handle mute state changes based on volume
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    
    // Video element volume is handled by the dedicated effect
  }, [isMuted]);

  // Add a helper function to safely set currentTime with validation
  const safeSetCurrentTime = useCallback((videoElement: HTMLVideoElement, time: number) => {
    if (!videoElement) return;
    
    // Ensure we have a valid, finite duration
    if (!videoElement.duration || isNaN(videoElement.duration) || !isFinite(videoElement.duration)) {
      return;
    }
    
    // Ensure the time value is finite and within bounds
    if (isNaN(time) || !isFinite(time)) {
      return;
    }
    
    // Clamp the value between 0 and duration
    const safeTime = Math.max(0, Math.min(videoElement.duration, time));
    
    try {
      videoElement.currentTime = safeTime;
    } catch (err) {
      console.warn('Failed to set video currentTime:', err);
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        // Just pause the video when playing
        videoRef.current.pause();
        setIsPlaying(false);
        
        // Set a data attribute to help track user-initiated pause
        videoRef.current.setAttribute('data-user-paused', 'true');
        // Also update our ref
        intentionallyPaused.current = true;
      } else {
        // Clear the user paused attribute
        videoRef.current.removeAttribute('data-user-paused');
        // Update our ref
        intentionallyPaused.current = false;
        
        // When resuming from pause, first jump to live edge then play
        if (isLive && videoRef.current) {
          // For live streams, jump to live edge before playing
          if (videoRef.current.duration) {
            safeSetCurrentTime(videoRef.current, videoRef.current.duration);
          }
          setIsAtLiveEdge(true);
        }
        
        // Then attempt to play
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setError(null);
          })
          .catch(err => {
            console.error('Error resuming playback:', err);
            // Keep the UI in the correct state even if play fails
            setIsPlaying(false);
            intentionallyPaused.current = true; // Keep the intentional pause state consistent
          });
      }
    }
  }, [isPlaying, isLive, safeSetCurrentTime]);

  const handleMuteToggle = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // If unmuting but volume is 0, set it to a reasonable level
    if (!newMutedState && volume === 0) {
      setVolume(0.5);
    }
    
    // Video element mute state is handled by the dedicated effect
  }, [isMuted, volume]);

  const jumpToLive = useCallback(() => {
    if (videoRef.current && duration) {
      safeSetCurrentTime(videoRef.current, duration);
      setIsAtLiveEdge(true);
    }
  }, [duration, safeSetCurrentTime]);

  const handleSeek = (value: number) => {
    const time = value;
    if (videoRef.current) {
      safeSetCurrentTime(videoRef.current, time);
      setCurrentTime(time);
      setIsAtLiveEdge(time >= duration - 2);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Define handleMouseLeave as a useCallback
  const handleMouseLeave = useCallback(() => {
    if (!isDraggingTime) {
      setIsControlsVisible(false);
    }
  }, [isDraggingTime]);

  // Update show/hide controls logic
  const showControls = useCallback(() => {
    setIsControlsVisible(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
      hideControlsTimeout.current = null;
    }
    
    if (!isDraggingTime) {
      hideControlsTimeout.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2000);
    }
  }, [isDraggingTime]);

  const handleProgress = () => {
    // Handle progress events without setting buffer progress
    if (videoRef.current) {
      // Process buffer information if needed in the future
    }
  };

  const toggleFullscreen = useCallback(() => {
    // Preveri, ali je naprava iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const videoElement = videoRef.current;
    const container = videoElement?.parentElement;
    
    if (!container) return;
    
    // Funkcija za preverjanje, če je element v celozaslonskem načinu
    const isFullScreenElement = () => {
      return !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
    };
    
    // Funkcija za izhod iz celozaslonskega načina
    const exitFullScreen = () => {
      const doc = document as any;
      
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
      
      setIsFullscreen(false);
    };
    
    if (!isFullScreenElement()) {
      // Za iOS naprave, uporabi webkitEnterFullscreen na video elementu
      if (isIOS && videoElement && videoElement.webkitEnterFullscreen) {
        videoElement.webkitEnterFullscreen();
        setIsFullscreen(true);
      } 
      // Za ostale naprave uporabi ustrezni Fullscreen API
      else {
        try {
          if (container.requestFullscreen) {
            container.requestFullscreen();
          } else if ((container as any).webkitRequestFullscreen) {
            (container as any).webkitRequestFullscreen();
          } else if ((container as any).mozRequestFullScreen) {
            (container as any).mozRequestFullScreen();
          } else if ((container as any).msRequestFullscreen) {
            (container as any).msRequestFullscreen();
          }
          setIsFullscreen(true);
        } catch (err) {
          console.error(`Error attempting to enable fullscreen:`, err);
        }
      }
    } else {
      exitFullScreen();
    }
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!videoRef.current || document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

    switch(e.code) {
      case 'Space':
        e.preventDefault();
        handlePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (videoRef.current) {
          safeSetCurrentTime(videoRef.current, currentTime - 5);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (videoRef.current) {
          safeSetCurrentTime(videoRef.current, currentTime + 5);
        }
        break;
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'M':
        e.preventDefault();
        handleMuteToggle();
        break;
      case 'L':
        e.preventDefault();
        if (isLive) jumpToLive();
        break;
    }
  }, [currentTime, handlePlayPause, handleMuteToggle, isLive, jumpToLive, toggleFullscreen, safeSetCurrentTime]);

  useEffect(() => {
    const token = getToken();
    const connectionId = `${username}-${Date.now()}`;
    connectionIdRef.current = connectionId;
    const wsUrl = `${API_WS_URL}?token=${token}&connectionId=${connectionId}`;
    
    // Reference to track if we need to reconnect when play state changes
    playStateRef.current = isPlaying;
    
    const connectWebSocket = () => {
      // If we already have a connection and it's open, don't create a new one
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected, not creating duplicate');
        return;
      }
      
      // If we have a connection that's in the process of connecting, don't create a new one
      if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
        console.log('WebSocket already connecting, not creating duplicate');
        return;
      }
      
      // Close any existing connection before creating a new one
      if (wsRef.current) {
        console.log('Closing existing WebSocket before creating new one');
        wsRef.current.close();
        wsRef.current = null;
      }
      
      console.log('Connecting to WebSocket:', wsUrl, 'Connection ID:', connectionIdRef.current);
      const ws = new WebSocket(wsUrl);

      // Heartbeat interval
      let heartbeatInterval: NodeJS.Timeout | null = null;
      
      // Activity check interval - this verifies the user is actively watching
      let activityCheckInterval: NodeJS.Timeout | null = null;
      
      // Last activity timestamp - used to detect if user is actually active
      let lastUserActivity = Date.now();
      let lastActivitySent = 0; // Track when we last sent an activity update
      
      // Update last activity timestamp when user interacts with the page
      const updateActivity = () => {
        lastUserActivity = Date.now();
        
        // Only send activity update if it's been more than 5 minutes since last update
        // or if this is the first activity update
        const timeSinceLastSent = lastUserActivity - lastActivitySent;
        const shouldSendUpdate = timeSinceLastSent >= 300000 || lastActivitySent === 0; // 5 minutes = 300000ms
        
        if (shouldSendUpdate && ws.readyState === WebSocket.OPEN) {
          lastActivitySent = lastUserActivity;
          ws.send(JSON.stringify({ 
            type: 'activity_check',
            timestamp: lastUserActivity,
            isPlaying: playStateRef.current && !intentionallyPaused.current,
            isVisible: document.visibilityState === 'visible',
            connectionId: connectionIdRef.current
          }));
        }
      };
      
      // Add event listeners to track user activity
      window.addEventListener('mousemove', updateActivity);
      window.addEventListener('keydown', updateActivity);
      window.addEventListener('click', updateActivity);
      window.addEventListener('scroll', updateActivity);
      
      // Also track visibility changes (tab switching)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          updateActivity();
        }
      });

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'viewerCount') {
            setViewerCount(data.count);
          }
          
          if (data.type === 'watchStats') {
            setWatchStats({
              watchTimeSeconds: data.watchTimeSeconds || 0,
              isWatchToEarnEnabled: data.isWatchToEarnEnabled
            });
            
            // If server says we're inactive but we have recent activity, send an update
            if (data.isActive === false && Date.now() - lastUserActivity < 300000) { // 5 minutes
              updateActivity();
            }
          }
          
          if (data.type === 'heartbeat_request') {
            
            const isUserActive = Date.now() - lastUserActivity < 300000; // 8 minutes
            const isVideoPlaying = playStateRef.current && !intentionallyPaused.current;
            const isPageVisible = document.visibilityState === 'visible';
            
            if (isUserActive && isVideoPlaying && isPageVisible) {
              ws.send(JSON.stringify({ 
                type: 'heartbeat',
                timestamp: Date.now(),
                isPlaying: isVideoPlaying,
                isVisible: isPageVisible,
                connectionId: connectionIdRef.current
              }));
            }
          }
          
          if (data.type === 'activity_confirmed') {
            console.log('Server confirmed user activity');
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = () => {
        console.error('WebSocket connection error');
        
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        
        if (activityCheckInterval) {
          clearInterval(activityCheckInterval);
          activityCheckInterval = null;
        }
        
        // Clean up event listeners
        window.removeEventListener('mousemove', updateActivity);
        window.removeEventListener('keydown', updateActivity);
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('scroll', updateActivity);
        
        // Attempt to reconnect after a delay
        const reconnectTimeout = setTimeout(connectWebSocket, 5000);
        return () => clearTimeout(reconnectTimeout);
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
        
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        
        if (activityCheckInterval) {
          clearInterval(activityCheckInterval);
          activityCheckInterval = null;
        }
        
        // Clean up event listeners
        window.removeEventListener('mousemove', updateActivity);
        window.removeEventListener('keydown', updateActivity);
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('scroll', updateActivity);
        
        // Attempt to reconnect after a delay if the connection was not closed normally 
        // or if it was closed due to a network issue
        if (event.code !== 1000) {
          const reconnectTimeout = setTimeout(connectWebSocket, 5000);
          return () => clearTimeout(reconnectTimeout);
        }
      };
      
      // When connection opens, set up intervals for heartbeats and activity checks
      ws.onopen = () => {
        console.log('WebSocket connection established for', username, 'Connection ID:', connectionIdRef.current);
        // Send initial activity status
        updateActivity();
        
        // Remove the client-side heartbeat interval since server sends heartbeat_request
        // The client will only respond to server heartbeat requests
        
        // Set up activity check interval (proactive updates)
        activityCheckInterval = setInterval(() => {
          const isUserActive = Date.now() - lastUserActivity < 480000; // 8 minutes
          const isVideoPlaying = playStateRef.current && !intentionallyPaused.current;
          const isPageVisible = document.visibilityState === 'visible';
          
          if (isUserActive && isVideoPlaying && isPageVisible && ws.readyState === WebSocket.OPEN) {
            // Check if we need to send an activity update (respecting the 5-minute throttle)
            const timeSinceLastSent = Date.now() - lastActivitySent;
            if (timeSinceLastSent >= 300000) { // 5 minutes
              lastActivitySent = Date.now();
              ws.send(JSON.stringify({ 
                type: 'activity_check',
                timestamp: Date.now(),
                isPlaying: isVideoPlaying,
                isVisible: isPageVisible,
                connectionId: connectionIdRef.current
              }));
            }
          }
        }, 300000); // Check every 5 minutes
      };

      wsRef.current = ws;

      // Cleanup function
      return () => {
        console.log('Cleaning up WebSocket connection for', username, 'Connection ID:', connectionIdRef.current);
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
        }
        
        if (activityCheckInterval) {
          clearInterval(activityCheckInterval);
        }
        
        // Clean up event listeners
        window.removeEventListener('mousemove', updateActivity);
        window.removeEventListener('keydown', updateActivity);
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('scroll', updateActivity);
        
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      };
    };

    connectWebSocket();

    return () => {
      console.log('Component unmounting, closing WebSocket for', username);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [username, API_WS_URL]); // Only reconnect if username or API URL changes

  // Send playback state updates without reconnecting the WebSocket
  useEffect(() => {
    playStateRef.current = isPlaying;
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'playback_update',
        isPlaying,
        isVisible: document.visibilityState === 'visible',
        timestamp: Date.now(),
        connectionId: connectionIdRef.current
      }));
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;

    const streamUrl = `${STREAM_SERVER_URL}/live/${username}/index.m3u8`;
    
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        backBufferLength: 90,
        maxBufferSize: 30 * 1000 * 1000,
        maxBufferLength: 30,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 6,
        maxMaxBufferLength: 30,
        liveDurationInfinity: true,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3,
        manifestLoadingRetryDelay: 500,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 3,
        levelLoadingRetryDelay: 500,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 500,
        startFragPrefetch: true,
        testBandwidth: true,
        progressive: true,
        lowLatencyMode: true
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      const attemptPlay = () => {
        // Multiple checks to ensure we should really be playing
        if (!videoRef.current || !isPlaying || intentionallyPaused.current) return;
        
        // Skip all auto-play attempts if data-user-paused is set
        if (videoRef.current.hasAttribute('data-user-paused')) return;
        
        if (isLive && videoRef.current.duration) {
          try {
            videoRef.current.currentTime = videoRef.current.duration;
            setIsAtLiveEdge(true);
          } catch (err) {
            console.warn('Could not seek to live edge:', err);
          }
        }
        
        videoRef.current.play()
          .then(() => {
            setError(null);
            setIsPlaying(true);
          })
          .catch(err => {
            if (err.name !== 'NotAllowedError') {
              console.error('Error playing video:', err);
              setError('Failed to start playback');
            } else {
              console.warn('Playback requires user interaction:', err);
            }
          });
      };

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Never auto-play if user has paused
        if (videoRef.current?.hasAttribute('data-user-paused')) return;
        
        if (isPlaying && !intentionallyPaused.current) {
          attemptPlay();
        }
      });
      
      hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
        if (isLive && data.details?.live) {
          setIsAtLiveEdge(true);
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error:', data);
              setError('Network error occurred. Stream may be offline.');
              setIsOffline(true);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error:', data);
              setError('Media error occurred. Trying to recover...');
              setIsOffline(false);
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error:', data);
              setError('Fatal error occurred. Please try again later.');
              setIsOffline(false);
              hls.destroy();
              break;
          }
        }
      });

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        // Triple check before attempting to auto-play:
        // 1. Is the video currently paused?
        // 2. Do we want to be playing (state)?
        // 3. Is this NOT a user-initiated pause?
        // 4. Check the intentionallyPaused ref
        if (videoRef.current?.paused && 
            isPlaying && 
            !videoRef.current.hasAttribute('data-user-paused') && 
            !intentionallyPaused.current) {
          attemptPlay();
        }
      });

      // Listen for play/pause events to track intentional pauses
      const handlePause = () => {
        if (!isPlaying) {
          intentionallyPaused.current = true;
        }
      };

      const handlePlay = () => {
        videoRef.current?.removeAttribute('data-user-paused');
        intentionallyPaused.current = false;
      };

      videoRef.current.addEventListener('pause', handlePause);
      videoRef.current.addEventListener('play', handlePlay);

      // Store a reference to the video element that we can use in cleanup
      const videoElement = videoRef.current;
      
      hlsRef.current = hls;

      return () => {
        // Use the stored reference instead of accessing videoRef.current in cleanup
        if (videoElement) {
          videoElement.removeEventListener('pause', handlePause);
          videoElement.removeEventListener('play', handlePlay);
        }
        
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Store a reference to the video element for both event handler and cleanup
      const videoElement = videoRef.current;
      videoElement.src = streamUrl;
      
      // Create a named function for the event listener so it can be removed properly
      const handleLoadedMetadata = () => {
        if (videoElement && 
            isPlaying && 
            !intentionallyPaused.current && 
            !videoElement.hasAttribute('data-user-paused')) {
          videoElement.play().catch(err => {
            if (err.name !== 'NotAllowedError') {
              console.error('Error playing video:', err);
              setError('Failed to start playback');
            }
          });
        }
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Update return to clean up this event listener
      return () => {
        // Use the stored reference instead of accessing videoRef.current
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else {
      setError('HLS is not supported in your browser');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [username, STREAM_SERVER_URL, isPlaying, isLive]);

  // Separate effect to handle volume and mute state changes
  useEffect(() => {
    if (videoRef.current) {
      // Store a reference to the video element
      const videoElement = videoRef.current;
      
      try {
        videoElement.volume = volume;
        videoElement.muted = isMuted;
      } catch (err) {
        console.error('Error setting volume/mute state:', err);
        // Don't set error state here to avoid interfering with playback
      }
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Handler for progress updates (buffer state)
      const progressHandler = () => handleProgress();
      
      // Handler for time updates (playback position)
      const timeUpdateHandler = () => handleTimeUpdate();
      
      // Custom play handler - only update state, don't force playback
      const playHandler = () => {
        setIsPlaying(true);
      };
      
      // Custom pause handler - check if it's a user-initiated pause
      const pauseHandler = () => {
        // If this has the user-paused attribute, respect the pause
        if (video.hasAttribute('data-user-paused')) {
          setIsPlaying(false);
        } else if (isPlaying) {
          // If we should be playing but the video is paused for some other reason
          // (buffering, etc), don't update isPlaying state, which could cause
          // unintended side effects or visual state mismatches
          console.log('Video paused but we want to be playing (likely buffering)');
        } else {
          setIsPlaying(false);
        }
      };
      
      video.addEventListener('progress', progressHandler);
      video.addEventListener('timeupdate', timeUpdateHandler);
      video.addEventListener('play', playHandler);
      video.addEventListener('pause', pauseHandler);
      
      return () => {
        // Use the stored video reference for cleanup
        video.removeEventListener('progress', progressHandler);
        video.removeEventListener('timeupdate', timeUpdateHandler);
        video.removeEventListener('play', playHandler);
        video.removeEventListener('pause', pauseHandler);
      };
    }
  }, [handleTimeUpdate, isPlaying]);

  // Update event listeners useEffect
  useEffect(() => {
    const videoElement = videoRef.current;
    const videoContainer = videoElement?.parentElement;
    if (!videoContainer) return;

    videoContainer.addEventListener('mousemove', showControls);
    videoContainer.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Use the stored reference instead of accessing videoRef.current in cleanup
      videoContainer.removeEventListener('mousemove', showControls);
      videoContainer.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleKeyDown);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
        hideControlsTimeout.current = null;
      }
    };
  }, [showControls, isDraggingTime, handleKeyDown, handleMouseLeave]);

  // Update fullscreen change handler
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
    showControls();
  }, [showControls]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  // Add an effect to update the intentionallyPaused ref when isPlaying changes
  useEffect(() => {
    intentionallyPaused.current = !isPlaying;
  }, [isPlaying]);

  // Preveri, ali je naprava mobilna
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };
    
    setIsMobileDevice(checkMobile());
  }, []);

  // Dodajmo stil za mobilne kontrole
  useEffect(() => {
    // Ustvarimo stil element za mobilne kontrole
    if (isMobileDevice) {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        .mobile-control-button {
          transform: scale(1.05);
          transition: transform 0.2s;
        }
        .mobile-control-button:active {
          transform: scale(0.95);
          opacity: 0.8;
        }
        /* iOS-specific improvements */
        input[type="range"]::-webkit-slider-thumb {
          width: 20px !important;
          height: 20px !important;
        }
        /* Remove tap highlight color on iOS */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [isMobileDevice]);

  return (
    <div 
      className={cn(
        "relative group md:rounded-xl overflow-hidden bg-black cursor-none",
        isControlsVisible && "cursor-auto"
      )}
      onMouseMove={showControls}
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => {
        if (!isDraggingTime) {
          setIsControlsVisible(false);
        }
      }}
      onTouchStart={() => {
        showControls();
        if (hideControlsTimeout.current) {
          clearTimeout(hideControlsTimeout.current);
          hideControlsTimeout.current = null;
        }
      }}
      onTouchEnd={() => {
        if (hideControlsTimeout.current) {
          clearTimeout(hideControlsTimeout.current);
        }
        hideControlsTimeout.current = setTimeout(() => {
          if (!isDraggingTime) {
            setIsControlsVisible(false);
          }
        }, 4000);
      }}
    >
      {/* Video Container */}
      <div className="aspect-video w-full bg-black relative">
        <video
          ref={videoRef}
          className="w-full h-full"
          playsInline
          autoPlay
          muted
          style={{
            objectFit: 'contain',
            backgroundColor: 'black'
          }}
        />

        {/* Gradient overlays - only show on controls visible */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isControlsVisible ? "opacity-100" : "opacity-0"
        )}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00ffff]/5 via-transparent to-transparent" />
        </div>

        {/* Controls overlay */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isControlsVisible ? "opacity-100" : "opacity-0",
            !isControlsVisible && "pointer-events-none"
          )}
        >
          {/* Stats - top right */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
            {/* Viewer count */}
            <Button
              type="text"
              icon={<UserOutlined style={{ fontSize: '14px' }} />}
              className="flex items-center gap-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 h-auto py-1.5 px-3"
            >
              <span className="text-xs font-medium text-white">
                {formatViewerCount(viewerCount)}
              </span>
            </Button>

            {/* Watch time */}
            {watchStats.isWatchToEarnEnabled && (
              <Button
                type="text"
                icon={<ClockCircleOutlined style={{ fontSize: '14px' }} />}
                className="flex items-center gap-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 h-auto py-1.5 px-3"
              >
                <span className="text-xs font-medium text-white">
                  {formatWatchTime(watchStats.watchTimeSeconds)}
                </span>
              </Button>
            )}
          </div>

          {/* Video controls */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent",
              "px-6 pb-6 pt-20 transition-all duration-300",
              isControlsVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Progress bar */}
            <div 
              className={cn(
                "relative mb-4 group/progress",
                !isLive && "cursor-pointer",
                isLive && "cursor-default"
              )}
              onMouseEnter={() => !isLive && setIsDraggingTime(true)}
              onMouseLeave={() => !isLive && setIsDraggingTime(false)}
            >
              {/* Background track */}
              <div className="transition-all duration-300 py-2">
                {/* Playback progress - for live stream, use a pulsing indicator instead of progress bar */}
                {isLive ? (
                  <div className="h-1 bg-gradient-to-r from-transparent via-[#00ffff]/50 to-transparent animate-pulse rounded-full" />
                ) : (
                  <Slider
                    value={currentTime}
                    min={0}
                    max={duration || 100}
                    onChange={handleSeek}
                    tooltip={{ formatter: (value) => formatTime(value || 0) }}
                    disabled={isLive}
                    style={{ 
                      margin: 0,
                    }}
                    trackStyle={{ backgroundColor: '#84eef5' }}
                    handleStyle={{ 
                      borderColor: '#84eef5',
                      boxShadow: '0 0 5px rgba(132, 238, 245, 0.5)' 
                    }}
                  />
                )}
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {/* Play/Pause */}
                <Button
                  type="text"
                  onClick={handlePlayPause}
                  icon={isPlaying ? 
                    <PauseCircleOutlined style={{ fontSize: '24px' }} /> : 
                    <PlayCircleOutlined style={{ fontSize: '24px' }} />
                  }
                  className="text-white hover:text-[#00ffff]"
                  style={{ padding: 0 }}
                />

                {/* Skip buttons - only show for non-live content */}
                {!isLive && (
                  <div className="flex items-center gap-4">
                    <Button
                      type="text"
                      icon={<BackwardOutlined style={{ fontSize: '20px' }} />}
                      onClick={() => {
                        if (videoRef.current) {
                          safeSetCurrentTime(videoRef.current, currentTime - 5);
                        }
                      }}
                      className="text-white/80 hover:text-white"
                      style={{ padding: 0 }}
                    />
                    <Button
                      type="text"
                      icon={<ForwardOutlined style={{ fontSize: '20px' }} />}
                      onClick={() => {
                        if (videoRef.current) {
                          safeSetCurrentTime(videoRef.current, currentTime + 5);
                        }
                      }}
                      className="text-white/80 hover:text-white"
                      style={{ padding: 0 }}
                    />
                  </div>
                )}

                {/* Volume control */}
                <div className="group/volume flex items-center gap-2">
                  <Button
                    type="text"
                    icon={isMuted ? <StopOutlined style={{ fontSize: '20px' }} /> : <SoundOutlined style={{ fontSize: '20px' }} />}
                    onClick={handleMuteToggle}
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    className="hover:text-white"
                  />
                  <div className="w-20 relative group-hover/volume:opacity-100 transition-all duration-300">
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={handleVolumeChange}
                      tooltip={{ formatter: (value) => `${Math.round((value || 0) * 100)}%` }}
                      style={{ 
                        margin: 0,
                      }}
                      trackStyle={{ backgroundColor: '#84eef5' }}
                      handleStyle={{ 
                        borderColor: '#84eef5',
                        boxShadow: '0 0 5px rgba(132, 238, 245, 0.5)' 
                      }}
                    />
                  </div>
                </div>

                {/* Time display - only show for non-live content */}
                {!isLive && (
                  <div className="text-white/80 text-sm font-medium space-x-1">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-white/40">/</span>
                    <span className="text-white/40">{formatTime(duration)}</span>
                  </div>
                )}
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-4">
                {/* Live button */}
                {isLive && (
                  <Button
                    type={isAtLiveEdge ? "primary" : "default"}
                    onClick={jumpToLive}
                    className={cn(
                      "flex items-center gap-2",
                      isAtLiveEdge 
                        ? "bg-red-500 text-white border-red-500" 
                        : "bg-white/10 text-white/60 hover:bg-red-500/80 hover:text-white border-transparent"
                    )}
                    style={{ 
                      height: '28px', 
                      padding: '0 12px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isAtLiveEdge ? "bg-white animate-pulse" : "bg-white/60"
                    )} />
                    LIVE
                  </Button>
                )}

                {/* Fullscreen button - z večjim območjem dotika za mobilne naprave */}
                <Button
                  type="text"
                  icon={isFullscreen ? 
                    <FullscreenExitOutlined style={{ fontSize: isMobileDevice ? '28px' : '24px' }} /> : 
                    <FullscreenOutlined style={{ fontSize: isMobileDevice ? '28px' : '24px' }} />
                  }
                  onClick={toggleFullscreen}
                  className={cn(
                    "text-white/80 hover:text-white touch-manipulation",
                    isMobileDevice && "mobile-control-button"
                  )}
                  style={{ 
                    padding: isMobileDevice ? '10px 14px' : '8px 12px',
                    height: 'auto',
                    minHeight: isMobileDevice ? '48px' : '44px',
                    minWidth: isMobileDevice ? '48px' : '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
          <div className="text-center space-y-4 p-6">
            {isOffline ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                  <UserOutlined style={{ fontSize: '32px', color: '#84eef5' }} />
                </div>
                <h3 className="text-white text-xl font-medium">{username} is offline</h3>
                <p className="text-white/60">The streamer will be back soon. Check back later!</p>
              </>
            ) : (
              <>
                <p className="text-red-500 font-medium">Error playing video</p>
                <p className="text-white/60 text-sm">{error}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
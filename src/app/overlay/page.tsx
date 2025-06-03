'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatOverlay } from '@/components/stream/chat/ChatOverlay';

// Component to handle the search params logic
function OverlayContent() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState<string>('');
  const [maxMessages, setMaxMessages] = useState<number>(20);
  const [fadeTime, setFadeTime] = useState<number>(60000); // 1 minute
  const [messageDuration, setMessageDuration] = useState<number>(300000); // 5 minutes
  
  useEffect(() => {
    // Get parameters from query params
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
    }
    
    // Get optional configuration from query params
    const maxMsgParam = searchParams.get('max');
    if (maxMsgParam && !isNaN(parseInt(maxMsgParam, 10))) {
      setMaxMessages(parseInt(maxMsgParam, 10));
    }
    
    const fadeParam = searchParams.get('fade');
    if (fadeParam && !isNaN(parseInt(fadeParam, 10))) {
      // Convert seconds to milliseconds
      setFadeTime(parseInt(fadeParam, 10) * 1000);
    }
    
    const durationParam = searchParams.get('duration');
    if (durationParam && !isNaN(parseInt(durationParam, 10))) {
      // Convert seconds to milliseconds
      setMessageDuration(parseInt(durationParam, 10) * 1000);
    }
  }, [searchParams]);

  // If no username provided, show an instructional screen
  if (!username) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center text-white bg-transparent p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Chat Overlay Setup</h1>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg max-w-2xl">
          <p className="mb-4">Please specify a username in the URL query parameter:</p>
          <code className="block bg-gray-800 p-2 rounded mb-6 text-green-400">
            /overlay?username=streamer_name
          </code>
          
          <h2 className="text-xl font-semibold mb-2">Additional Options:</h2>
          <ul className="text-left mb-4 space-y-1">
            <li><code className="text-yellow-300">max</code>: Maximum number of messages (default: 20)</li>
            <li><code className="text-yellow-300">fade</code>: Seconds before messages start to fade (default: 60)</li>
            <li><code className="text-yellow-300">duration</code>: Seconds before messages disappear (default: 300)</li>
          </ul>
          
          <p className="text-sm italic text-gray-400">
            Example: <code>/overlay?username=streamer_name&max=15&fade=30&duration=120</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-transparent">
      <ChatOverlay 
        username={username}
        maxMessages={maxMessages} 
        fadeTime={fadeTime} 
        messageDuration={messageDuration} 
      />
    </div>
  );
}

// Loading fallback for Suspense
function LoadingOverlay() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <div className="text-white">Loading chat overlay...</div>
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <OverlayContent />
    </Suspense>
  );
} 
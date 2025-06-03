"use client";

import { useState, useEffect } from "react";
import { Card, Progress, Typography, Spin } from "antd";
import { LoadingOutlined, ClockCircleOutlined, RocketOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface CharacterGenerationProgressProps {
  onComplete?: () => void;
  characterId?: string;
}

export function CharacterGenerationProgress({
  onComplete,
  characterId,
}: CharacterGenerationProgressProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(180); // 3 minutes in seconds
  const [generationStage, setGenerationStage] = useState("Initializing AI models...");
  const [isComplete, setIsComplete] = useState(false);

  // Stages of character generation with approximate timing
  const generationStages = [
    { stage: "Initializing AI models...", threshold: 5 },
    { stage: "Analyzing character description...", threshold: 15 },
    { stage: "Generating character personality...", threshold: 30 },
    { stage: "Creating character background story...", threshold: 45 },
    { stage: "Defining character traits and behaviors...", threshold: 60 },
    { stage: "Building character knowledge base...", threshold: 75 },
    { stage: "Finalizing character details...", threshold: 90 },
    { stage: "Almost done! Preparing final touches...", threshold: 95 },
  ];

  // Effect to update progress and stage
  useEffect(() => {
    // Ensure the progress always takes 3 minutes regardless of API response
    const totalDuration = 100; // 3 minutes in seconds
    const progressStep = 100 / totalDuration; // How much to increase per second
    
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        // Calculate new progress - rounded to whole numbers
        const newProgress = Math.min(Math.round(prevProgress + progressStep), 99);
        
        // Update generation stage based on progress
        const stageIndex = generationStages.findIndex(
          (s) => newProgress < s.threshold
        );
        
        if (stageIndex !== -1) {
          setGenerationStage(generationStages[Math.max(0, stageIndex)].stage);
        } else {
          setGenerationStage("Almost done! Preparing final touches...");
        }
        
        return newProgress; // Cap at 99% until complete
      });
    }, 1000);

    // Countdown timer
    const timerInterval = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1;
        
        // When timer reaches zero, mark as complete
        if (newTime <= 0) {
          clearInterval(progressInterval);
          clearInterval(timerInterval);
          
          // Set progress to 100% when complete
          setProgress(100);
          setGenerationStage("Character generation complete!");
          setIsComplete(true);
          
          // Redirect after a short delay
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            } else {
              // Default redirect to character list if no specific ID or callback
              router.push("/en/dashboard/plugins/characters");
            }
          }, 1500); // Slightly longer delay to see the 100% state
        }
        
        return Math.max(0, newTime);
      });
    }, 1000);

    // Cleanup intervals on unmount
    return () => {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
    };
  }, [router, onComplete, characterId]);

  // Format remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <Card 
          className={`bg-secondary/95 border-none shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ${
            isComplete ? 'border-2 border-green-500/50 shadow-green-500/20' : ''
          }`}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`
                text-5xl p-5 rounded-full transition-all duration-300
                ${isComplete ? 
                  'text-green-400 bg-green-400/20 animate-bounce' : 
                  'text-primary bg-primary/10 animate-pulse'
                }
              `}>
                <RocketOutlined />
              </div>
            </div>
            <Title level={2} className="text-white mb-2">
              {isComplete ? "Character Successfully Generated!" : "Your Character is Being Generated"}
            </Title>
            <Text className="text-zinc-300 text-lg block mb-2">
              {isComplete ? 
                "Redirecting you to your character list..." : 
                "This process takes approximately 1-3 minutes"
              }
            </Text>
            {!isComplete && (
              <Text className="text-zinc-400 block">
                Please don't close this window or navigate away
              </Text>
            )}
          </div>

          <div className="mb-8">
            <Progress 
              percent={progress} 
              status={isComplete ? "success" : "active"} 
              strokeColor={isComplete ? 
                "#52c41a" : 
                {
                  '0%': '#4096ff',
                  '100%': '#84eef5',
                }
              }
              strokeWidth={10}
              className="mb-4"
              format={percent => `${Math.round(percent || 0)}%`}
            />
            
            {!isComplete && (
              <div className="flex justify-between items-center">
                <Text className="text-zinc-200 text-base">
                  <Spin indicator={<LoadingOutlined spin className="mr-2 text-primary" />} />
                  {generationStage}
                </Text>
                <Text className="text-zinc-300 text-base">
                  <ClockCircleOutlined className="mr-2 text-primary" />
                  <span className="font-mono">{formatTime(remainingTime)}</span> remaining
                </Text>
              </div>
            )}
          </div>

          <div className="bg-[#011528]/80 rounded-lg p-6 mt-6 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/30 text-blue-400">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm0 2.4h1.2V12H7.4V6.4z" fill="currentColor"/>
                  </svg>
                </span>
              </div>
              <div>
                <Text strong className="text-zinc-200 text-lg block mb-2">
                  {isComplete ? "Character Creation Complete!" : "What's happening?"}
                </Text>
                <Text className="text-zinc-300 text-base leading-relaxed">
                  {isComplete ? 
                    "Your AI character has been successfully created with a unique personality, backstory, and conversational patterns. You'll be redirected to your character list in a moment." :
                    "Our AI is analyzing your character description, generating a unique personality, creating a detailed backstory, and setting up conversational patterns. This complex process ensures your character has depth, consistency, and engaging interactions."
                  }
                </Text>
                
                {!isComplete && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3">
                      <div className="font-medium text-blue-400 mb-1">Character Analysis</div>
                      <div className="text-zinc-400">Processing your description to understand the core personality traits</div>
                    </div>
                    <div className="bg-purple-900/20 border border-purple-800/30 rounded-md p-3">
                      <div className="font-medium text-purple-400 mb-1">Config generation</div>
                      <div className="text-zinc-400">Generating the config file for the character</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 
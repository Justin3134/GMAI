import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Loader2 } from 'lucide-react';
import forestScene from '@/assets/forest-scene.jpg';

export function StoryPanel() {
  const gameState = useGameStore((state) => state.gameState);
  const sceneImageUrl = useGameStore((state) => state.sceneImageUrl);
  const isLoadingAction = useGameStore((state) => state.isLoadingAction);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!gameState?.currentStory) return;
    
    setIsTyping(true);
    setDisplayedText('');
    
    const words = gameState.currentStory.split(' ');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText((prev) => 
          prev ? `${prev} ${words[currentIndex]}` : words[currentIndex]
        );
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 80);
    
    return () => clearInterval(interval);
  }, [gameState?.currentStory]);

  if (!gameState) return null;

  // Use Freepik image if available, fallback to local asset
  const displayImage = sceneImageUrl || forestScene;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex-1 flex flex-col overflow-hidden rounded-2xl"
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoadingAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm z-20 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating your adventure...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Badge - Floating */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-background/90 backdrop-blur-md rounded-lg shadow-lg text-sm">
        <span>{gameState.location.emoji}</span>
        <span className="font-semibold text-foreground">{gameState.location.name}</span>
      </div>
      
      {/* Scene Media - Fixed Size Box */}
      <div className="relative flex-1 w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
        <div className="relative w-full max-w-6xl aspect-video">
          {displayImage?.includes('data:video/') || displayImage?.endsWith('.mp4') ? (
            <motion.video
              key={displayImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              src={displayImage}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.poster = forestScene;
              }}
            />
          ) : (
            <motion.img
              key={displayImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              src={displayImage}
              alt="Adventure scene"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.src = forestScene;
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
        </div>
      </div>

      {/* Story Text Bar - Above Image */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/90 to-transparent backdrop-blur-md px-6 py-3 z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto">
          <p className={`text-base md:text-lg leading-relaxed text-white font-medium ${isTyping ? 'typewriter-cursor' : ''}`}>
            {displayedText}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

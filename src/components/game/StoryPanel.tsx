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
      className="relative flex-1 flex flex-col overflow-hidden"
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoadingAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating your adventure...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Badge - Floating */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-md rounded-xl shadow-lg">
        <span className="text-base">📍</span>
        <span className="text-sm font-semibold text-foreground">
          {gameState.location.emoji} {gameState.location.name}
        </span>
      </div>
      
      {/* Scene Image - Fullscreen */}
      <div className="relative rounded-2xl overflow-hidden flex-1 w-full h-full">
        <motion.img
          key={displayImage}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          src={displayImage}
          alt="Adventure scene"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if Freepik image fails to load
            e.currentTarget.src = forestScene;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent pointer-events-none" />
        
        {/* Story Text Overlay on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background/95 via-background/80 to-transparent">
          <p className={`text-xl leading-relaxed text-foreground font-medium drop-shadow-lg ${isTyping ? 'typewriter-cursor' : ''}`}>
            {displayedText}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

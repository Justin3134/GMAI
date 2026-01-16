import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import forestScene from '@/assets/forest-scene.jpg';

export function StoryPanel() {
  const gameState = useGameStore((state) => state.gameState);
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-game flex-1 flex flex-col overflow-hidden"
    >
      {/* Location Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-kid-xl">📍</span>
        <span className="text-kid font-semibold text-foreground">
          {gameState.location.emoji} {gameState.location.name}
        </span>
      </div>
      
      {/* Scene Image */}
      <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={forestScene}
          alt="Adventure scene"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
      </div>
      
      {/* Story Text */}
      <div className="flex-1 min-h-[120px]">
        <p className={`text-kid-lg leading-relaxed text-foreground ${isTyping ? 'typewriter-cursor' : ''}`}>
          {displayedText}
        </p>
      </div>
    </motion.div>
  );
}

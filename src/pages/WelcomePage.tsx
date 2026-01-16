import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import forestScene from '@/assets/forest-scene.jpg';

export default function WelcomePage() {
  const gameState = useGameStore((state) => state.gameState);
  const hasExistingGame = !!gameState;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${forestScene})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/10 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Title */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4"
          >
            <h1 className="text-kid-5xl font-display text-gradient-hero text-shadow-hero mb-2">
              🎭 ADVENTURE TALES
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-kid-xl text-card font-semibold text-shadow-game mb-12"
          >
            Learn While You Play! ✨
          </motion.p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <Link to="/character-create">
            <Button className="btn-primary-game w-full gap-3 text-kid-lg">
              <Sparkles className="w-6 h-6" />
              Start New Adventure
            </Button>
          </Link>

          {hasExistingGame && (
            <Link to="/game">
              <Button className="btn-secondary-game w-full gap-3 text-kid-lg">
                <Play className="w-6 h-6" />
                Continue Last Game
              </Button>
            </Link>
          )}

          {hasExistingGame && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-card/80"
            >
              Playing as {gameState.character.name} the {gameState.character.class}
            </motion.p>
          )}
        </motion.div>

        {/* Bottom Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-6 flex gap-6"
        >
          <Link 
            to="/parent"
            className="text-sm text-card/70 hover:text-card transition-colors underline"
          >
            👨‍👩‍👧 Parent Dashboard
          </Link>
          <Link 
            to="/teacher"
            className="text-sm text-card/70 hover:text-card transition-colors underline"
          >
            👩‍🏫 Teacher Dashboard
          </Link>
          <Link 
            to="/agents"
            className="text-sm text-card/70 hover:text-card transition-colors underline"
          >
            🤖 Agent Demo
          </Link>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 text-kid-4xl float"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-32 right-16 text-kid-3xl float"
        >
          🧙
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-32 left-20 text-kid-3xl float"
        >
          🗡️
        </motion.div>
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-40 right-24 text-kid-3xl float"
        >
          📚
        </motion.div>
      </div>
    </div>
  );
}

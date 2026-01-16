import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

const CLASS_EMOJIS = {
  knight: '🗡️',
  wizard: '🪄',
  rogue: '🎯',
};

const CLASS_LABELS = {
  knight: 'Knight',
  wizard: 'Wizard',
  rogue: 'Rogue',
};

export function CharacterCard() {
  const gameState = useGameStore((state) => state.gameState);

  if (!gameState) return null;

  const { character } = gameState;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-game flex items-center gap-4 bg-card/90 backdrop-blur-sm"
    >
      <div className="text-kid-3xl">
        {CLASS_EMOJIS[character.class]}
      </div>
      
      <div className="flex-1">
        <h2 className="text-kid-lg font-bold text-foreground">
          {character.name} the {CLASS_LABELS[character.class]}
        </h2>
        
        <div className="flex items-center gap-4 mt-2">
          {/* Health */}
          <div className="flex items-center gap-1">
            {Array.from({ length: character.maxHealth }).map((_, i) => (
              <span
                key={i}
                className={`text-kid transition-all duration-300 ${
                  i < character.health ? 'heart-beat' : 'opacity-30'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
          
          {/* Magic */}
          <div className="flex items-center gap-1">
            {Array.from({ length: character.maxMagic }).map((_, i) => (
              <span
                key={i}
                className={`text-kid transition-all duration-300 ${
                  i < character.magic ? 'star-shine' : 'opacity-30'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Level */}
      <div className="text-center px-4">
        <div className="text-kid-2xl font-bold text-primary">
          {character.level}
        </div>
        <div className="text-sm text-muted-foreground">Level</div>
      </div>
    </motion.div>
  );
}

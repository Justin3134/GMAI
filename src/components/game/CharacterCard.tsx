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
      className="flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-lg"
    >
      <div className="text-lg">
        {CLASS_EMOJIS[character.class]}
      </div>
      
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-foreground">
          {character.name} the {CLASS_LABELS[character.class]}
        </h2>
        
        {/* Health */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: character.maxHealth }).map((_, i) => (
            <span
              key={i}
              className={`text-xs transition-all duration-300 ${
                i < character.health ? 'heart-beat' : 'opacity-30'
              }`}
            >
              ❤️
            </span>
          ))}
        </div>
        
        {/* Magic */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: character.maxMagic }).map((_, i) => (
            <span
              key={i}
              className={`text-xs transition-all duration-300 ${
                i < character.magic ? 'star-shine' : 'opacity-30'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Level */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
          <span className="font-bold text-primary">{character.level}</span>
          <span>Lvl</span>
        </div>
      </div>
    </motion.div>
  );
}

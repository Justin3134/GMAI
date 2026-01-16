import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

const DEFAULT_ACHIEVEMENTS = [
  { id: 'first_quest', name: 'First Quest', emoji: '🌟', description: 'Complete your first quest' },
  { id: 'math_master', name: 'Math Master', emoji: '🧮', description: 'Solve 10 math problems' },
  { id: 'word_wizard', name: 'Word Wizard', emoji: '📚', description: 'Learn 20 new words' },
  { id: 'brave_heart', name: 'Brave Heart', emoji: '💪', description: 'Face your first challenge' },
];

export function AchievementList() {
  const gameState = useGameStore((state) => state.gameState);

  if (!gameState) return null;

  const earnedIds = new Set(gameState.achievements.map((a) => a.id));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="card-game"
    >
      <h3 className="text-kid font-bold text-foreground mb-3 flex items-center gap-2">
        🏆 Achievements
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {DEFAULT_ACHIEVEMENTS.map((achievement, index) => {
          const isEarned = earnedIds.has(achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                text-kid-xl p-2 rounded-lg transition-all
                ${isEarned 
                  ? 'bg-gold/20 sparkle' 
                  : 'bg-muted/50 opacity-40 grayscale'
                }
              `}
              title={achievement.name}
            >
              {achievement.emoji}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

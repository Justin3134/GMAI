import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Trophy, Target, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/stores/gameStore';

export default function ReportPage() {
  const answersCorrect = useGameStore((state) => state.answersCorrect);
  const answersWrong = useGameStore((state) => state.answersWrong);
  const totalQuestions = useGameStore((state) => state.totalQuestions);
  const gameState = useGameStore((state) => state.gameState);
  const resetGame = useGameStore((state) => state.resetGame);

  const accuracy = totalQuestions > 0 
    ? Math.round((answersCorrect / totalQuestions) * 100) 
    : 0;

  const handleNewAdventure = () => {
    resetGame();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Adventure Complete!
            </h1>
            <p className="text-muted-foreground">
              {gameState?.character.name}, you did amazing!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 text-center bg-green-50 dark:bg-green-950/20">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {answersCorrect}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 text-center bg-red-50 dark:bg-red-950/20">
                <Target className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {answersWrong}
                </div>
                <div className="text-sm text-muted-foreground">Missed</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 text-center bg-blue-50 dark:bg-blue-950/20">
                <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {accuracy}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </Card>
            </motion.div>
          </div>

          {/* Achievement Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/10 rounded-lg p-6 text-center mb-8"
          >
            <p className="text-lg font-semibold text-foreground">
              {accuracy >= 80 && "🌟 Outstanding! You're a math wizard!"}
              {accuracy >= 60 && accuracy < 80 && "✨ Great job! Keep practicing!"}
              {accuracy >= 40 && accuracy < 60 && "💪 Good effort! You're learning!"}
              {accuracy < 40 && "🎯 Nice try! Practice makes perfect!"}
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link to="/" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleNewAdventure}
              >
                <Home className="w-5 h-5" />
                New Adventure
              </Button>
            </Link>
            <Link to="/parent" className="flex-1">
              <Button className="w-full gap-2">
                View Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}


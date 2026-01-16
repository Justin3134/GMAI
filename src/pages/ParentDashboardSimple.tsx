import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, Brain, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/stores/gameStore';

export default function ParentDashboardSimple() {
  const gameState = useGameStore((state) => state.gameState);
  const answersCorrect = useGameStore((state) => state.answersCorrect);
  const answersWrong = useGameStore((state) => state.answersWrong);
  const totalQuestions = answersCorrect + answersWrong;
  const accuracy = totalQuestions > 0 ? Math.round((answersCorrect / totalQuestions) * 100) : 0;

  const childName = gameState?.character.name || 'Student';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              📊 {childName}'s Progress
            </h1>
            <p className="text-muted-foreground">Parent Dashboard</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{answersCorrect}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{answersWrong}</div>
              <div className="text-sm text-muted-foreground">Missed</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{gameState?.character.level || 1}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </Card>
          </motion.div>
        </div>

        {/* Performance Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">📈 Learning Summary</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                ✅ <strong>{childName}</strong> has answered {totalQuestions} questions total
              </p>
              <p>
                🎯 Current accuracy: <strong className={accuracy >= 70 ? 'text-green-600' : 'text-yellow-600'}>{accuracy}%</strong>
              </p>
              <p>
                {accuracy >= 80 && "🌟 Excellent work! Keep up the great progress!"}
                {accuracy >= 60 && accuracy < 80 && "✨ Good progress! Consistent practice is paying off."}
                {accuracy >= 40 && accuracy < 60 && "💪 Making progress! More practice will help."}
                {accuracy < 40 && totalQuestions > 0 && "🎯 Keep trying! Learning takes time."}
                {totalQuestions === 0 && "🎮 Start an adventure to track progress!"}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Safety Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">🛡️ Safety & Content</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>✅ All content reviewed by AI Safety Agent</p>
              <p>✅ Age-appropriate stories and challenges</p>
              <p>✅ No inappropriate content allowed</p>
              <p>✅ COPPA compliant data handling</p>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Link to="/game" className="flex-1">
            <Button className="w-full">Continue Adventure</Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full">Back Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, TrendingUp, Trophy, Target, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/stores/gameStore';
import { api } from '@/lib/api';

export default function TeacherDashboardSimple() {
  const gameState = useGameStore((state) => state.gameState);
  const answersCorrect = useGameStore((state) => state.answersCorrect);
  const answersWrong = useGameStore((state) => state.answersWrong);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!gameState) return;
      
      try {
        const kidId = gameState.character.name.toLowerCase().replace(/\s+/g, '_');
        const data = await api.getTeacherOverview(kidId);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch teacher dashboard:', error);
      }
    };

    fetchData();
  }, [gameState]);

  const childName = gameState?.character.name || 'Student';
  const totalQuestions = answersCorrect + answersWrong;
  const accuracy = totalQuestions > 0 ? Math.round((answersCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              🎓 {childName}'s Educational Progress
            </h1>
            <p className="text-muted-foreground">Teacher Dashboard</p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </Card>

          <Card className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{answersCorrect}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </Card>

          <Card className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </Card>

          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{gameState?.character.level || 1}</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </Card>
        </div>

        {/* Learning Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Learning Insights
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Math Skills</span>
                <span className="text-sm text-muted-foreground">
                  {accuracy >= 80 ? '⭐⭐⭐ Advanced' : accuracy >= 60 ? '⭐⭐ Proficient' : '⭐ Developing'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Engagement Level</span>
                <span className="text-sm text-muted-foreground">
                  {totalQuestions >= 10 ? '⭐⭐⭐ Highly Engaged' : totalQuestions >= 5 ? '⭐⭐ Active' : '⭐ Getting Started'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Current Level</span>
                <span className="text-sm text-muted-foreground">Grade {gameState?.character.level || 1}-{(gameState?.character.level || 1) + 1}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">💡 Recommendations</h2>
            <ul className="space-y-2 text-muted-foreground">
              {accuracy >= 80 && (
                <li>✨ {childName} is excelling! Consider advancing to harder challenges.</li>
              )}
              {accuracy >= 60 && accuracy < 80 && (
                <li>📚 {childName} is doing well. Continue with current difficulty level.</li>
              )}
              {accuracy < 60 && totalQuestions > 0 && (
                <li>🎯 More practice needed. Consider additional review sessions.</li>
              )}
              <li>🎮 AI adapts difficulty based on performance automatically</li>
              <li>🔊 Voice interaction helps with engagement</li>
              <li>🖼️ Visual storytelling aids comprehension</li>
            </ul>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Link to="/game" className="flex-1">
            <Button className="w-full">Back to Game</Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full">Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


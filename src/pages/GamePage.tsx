import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Beaker, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { CharacterCard } from '@/components/game/CharacterCard';
import { StoryPanel } from '@/components/game/StoryPanel';
import { VoiceButton } from '@/components/game/VoiceButton';
import { InventoryGrid } from '@/components/game/InventoryGrid';
import { AchievementList } from '@/components/game/AchievementList';
import { EducationalChallenge } from '@/components/game/EducationalChallenge';
import { AgentActivityFeed } from '@/components/game/AgentActivityFeed';
import { MetricCard } from '@/components/game/MetricCard';
import type { EducationalChallenge as ChallengeType, AgentDecision } from '@/types/game';

// Mock challenge for demo
const DEMO_CHALLENGE: ChallengeType = {
  id: 'math-1',
  subject: 'math',
  difficulty: 3,
  question: 'The wizard found 24 magic crystals. He wants to share them equally among 4 treasure chests. How many crystals go in each chest?',
  options: ['4 crystals', '6 crystals', '8 crystals', '12 crystals'],
  correctAnswer: 1,
  hint: 'Try dividing the total number by 4!',
  context: 'To unlock the enchanted door, solve this puzzle...',
};

export default function GamePage() {
  const navigate = useNavigate();
  const gameState = useGameStore((state) => state.gameState);
  const showAgentPanel = useGameStore((state) => state.showAgentPanel);
  const setShowAgentPanel = useGameStore((state) => state.setShowAgentPanel);
  const setChallenge = useGameStore((state) => state.setChallenge);
  const setShowChallenge = useGameStore((state) => state.setShowChallenge);
  const addAgentDecision = useGameStore((state) => state.addAgentDecision);

  useEffect(() => {
    if (!gameState) {
      navigate('/');
    }
  }, [gameState, navigate]);

  // Simulate agent activity for demo
  useEffect(() => {
    if (!gameState) return;

    const decisions: Omit<AgentDecision, 'timestamp'>[] = [
      { agentName: 'Story Agent', agentEmoji: '📖', action: 'Generated quest: Dragon rescue', status: 'success', duration: 1.2 },
      { agentName: 'Safety Agent', agentEmoji: '🛡️', action: 'Reviewed content: All clear', status: 'success', duration: 0.6 },
      { agentName: 'Education Agent', agentEmoji: '📚', action: 'Prepared math challenge: Division', status: 'success', details: 'Difficulty: Grade 3', duration: 0.8 },
      { agentName: 'Orchestrator', agentEmoji: '🎯', action: 'All agents approved → Proceeding', status: 'success', duration: 0.3 },
    ];

    decisions.forEach((decision, index) => {
      setTimeout(() => {
        addAgentDecision({ ...decision, timestamp: new Date() });
      }, (index + 1) * 1500);
    });
  }, [gameState, addAgentDecision]);

  const handleTestChallenge = () => {
    setChallenge(DEMO_CHALLENGE);
    setShowChallenge(true);
  };

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-background">
      <EducationalChallenge />

      <div className={`flex h-screen ${showAgentPanel ? 'gap-4 p-4' : ''}`}>
        {/* Main Game Area */}
        <div className={`flex-1 flex flex-col ${showAgentPanel ? '' : 'p-4'}`}>
          {/* Top Bar */}
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="rounded-xl">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            
            <div className="flex-1">
              <CharacterCard />
            </div>

            <Button
              variant="outline"
              onClick={handleTestChallenge}
              className="gap-2 rounded-xl"
            >
              <Beaker className="w-5 h-5" />
              Test Challenge
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowAgentPanel(!showAgentPanel)}
              className="gap-2 rounded-xl"
            >
              {showAgentPanel ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              {showAgentPanel ? 'Hide' : 'Show'} Agent Panel
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex gap-4 min-h-0">
            {/* Story + Voice */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <StoryPanel />
              <VoiceButton />
            </div>

            {/* Right Sidebar */}
            <div className="w-64 flex flex-col gap-4">
              <InventoryGrid />
              <AchievementList />
              
              {/* Quest Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card-game"
              >
                <h3 className="text-kid font-bold text-foreground mb-2">
                  🗺️ Quest Progress
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(gameState.questProgress / gameState.totalQuests) * 100}%` }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {gameState.questProgress}/{gameState.totalQuests}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Agent Panel (Demo View) */}
        {showAgentPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-96 flex flex-col gap-4"
          >
            <AgentActivityFeed />

            <div className="grid grid-cols-2 gap-2">
              <MetricCard
                title="Engagement"
                value="87%"
                emoji="📊"
                trend="up"
                subtitle="+5% today"
              />
              <MetricCard
                title="Learning"
                value="1.4x"
                emoji="🧠"
                trend="up"
                subtitle="velocity"
              />
              <MetricCard
                title="Session"
                value="18 min"
                emoji="⏱️"
                subtitle="average"
              />
              <MetricCard
                title="Accuracy"
                value="92%"
                emoji="🎯"
                trend="up"
                subtitle="+3%"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

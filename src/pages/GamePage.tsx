import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { CharacterCard } from '@/components/game/CharacterCard';
import { StoryPanel } from '@/components/game/StoryPanel';
import { VoiceButton } from '@/components/game/VoiceButton';
import { EducationalChallenge } from '@/components/game/EducationalChallenge';
import type { AgentDecision } from '@/types/game';

export default function GamePage() {
  const navigate = useNavigate();
  const gameState = useGameStore((state) => state.gameState);
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

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-background">
      <EducationalChallenge />

      <div className="flex h-screen">
        {/* Main Game Area */}
        <div className="flex-1 flex flex-col p-4">
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

          </div>

          {/* Main Content - Story takes full width */}
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <StoryPanel />
            <VoiceButton />
          </div>
        </div>

      </div>
    </div>
  );
}

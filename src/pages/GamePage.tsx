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
    <div className="min-h-screen bg-background relative">
      <EducationalChallenge />

      {/* Compact Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="rounded-lg h-8">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
          <CharacterCard />
        </div>
        
        <Link to="/">
          <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs">
            End Journey
          </Button>
        </Link>
      </div>

      {/* Fullscreen Story */}
      <div className="h-screen flex flex-col pt-12">
        <div className="flex-1 min-h-0 pb-32">
          <StoryPanel />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border p-4">
          <VoiceButton />
        </div>
      </div>
    </div>
  );
}

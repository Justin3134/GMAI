import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentActivityFeed } from '@/components/game/AgentActivityFeed';
import { MetricCard } from '@/components/game/MetricCard';
import { useGameStore } from '@/stores/gameStore';
import type { AgentDecision } from '@/types/game';

const DEMO_SEQUENCE: Omit<AgentDecision, 'timestamp'>[] = [
  { agentName: 'Story Agent', agentEmoji: '📖', action: 'Analyzing player progress...', status: 'pending', duration: 0.5 },
  { agentName: 'Story Agent', agentEmoji: '📖', action: 'Generated quest: Save the Crystal Dragon', status: 'success', duration: 1.2 },
  { agentName: 'Safety Agent', agentEmoji: '🛡️', action: 'Reviewing content for age-appropriateness...', status: 'pending', duration: 0.3 },
  { agentName: 'Safety Agent', agentEmoji: '🛡️', action: 'Blocked: "scary monster" → Using "friendly dragon"', status: 'warning', duration: 0.6 },
  { agentName: 'Safety Agent', agentEmoji: '🛡️', action: 'Content approved: Safe for ages 8-12', status: 'success', duration: 0.2 },
  { agentName: 'Education Agent', agentEmoji: '📚', action: 'Assessing player skill level...', status: 'pending', duration: 0.4 },
  { agentName: 'Education Agent', agentEmoji: '📚', action: 'Generated challenge: Division (Grade 3)', status: 'success', details: 'Difficulty: 3/5', duration: 0.8 },
  { agentName: 'Voice Agent', agentEmoji: '🎤', action: 'Synthesizing narrative audio...', status: 'pending', duration: 0.6 },
  { agentName: 'Voice Agent', agentEmoji: '🎤', action: 'Audio ready: 12 second narration', status: 'success', duration: 1.5 },
  { agentName: 'Orchestrator', agentEmoji: '🎯', action: 'All agents approved → Delivering experience', status: 'success', duration: 0.3 },
];

export default function AgentDemoPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const addAgentDecision = useGameStore((state) => state.addAgentDecision);
  const clearAgentDecisions = useGameStore((state) => state.clearAgentDecisions);

  useEffect(() => {
    if (!isRunning) return;

    if (currentIndex >= DEMO_SEQUENCE.length) {
      setIsRunning(false);
      return;
    }

    const timeout = setTimeout(() => {
      addAgentDecision({ ...DEMO_SEQUENCE[currentIndex], timestamp: new Date() });
      setCurrentIndex((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timeout);
  }, [isRunning, currentIndex, addAgentDecision]);

  const handleStart = () => {
    clearAgentDecisions();
    setCurrentIndex(0);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIndex(0);
    clearAgentDecisions();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-kid-2xl font-display text-foreground">
              🤖 Agent Coordination Panel
            </h1>
            <p className="text-muted-foreground">
              Watch AI agents work together in real-time
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} className="gap-2 bg-success hover:bg-success/90">
                <Play className="w-5 h-5" />
                {currentIndex > 0 ? 'Resume' : 'Start Demo'}
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" className="gap-2">
                <Pause className="w-5 h-5" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[500px]"
            >
              <AgentActivityFeed />
            </motion.div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <MetricCard
                title="Story Agent"
                value="1.2s"
                subtitle="avg response"
                emoji="📖"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MetricCard
                title="Safety Agent"
                value="0.6s"
                subtitle="avg review"
                emoji="🛡️"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MetricCard
                title="Education Agent"
                value="0.9s"
                subtitle="avg generation"
                emoji="📚"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MetricCard
                title="Total Pipeline"
                value="3.2s"
                subtitle="end-to-end"
                emoji="⚡"
                trend="up"
              />
            </motion.div>

            {/* System Learning */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card-game"
            >
              <h3 className="text-kid font-bold text-foreground mb-4">
                🧠 System Learning
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement Score</span>
                  <span className="font-bold text-success">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Learning Velocity</span>
                  <span className="font-bold text-primary">1.4x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Length</span>
                  <span className="font-bold text-foreground">18 min avg</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-game mt-6"
        >
          <h2 className="text-kid-lg font-bold text-foreground mb-6 text-center">
            🏗️ Multi-Agent Architecture
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-4">
            {[
              { emoji: '👧', label: 'Child Input', color: 'bg-secondary' },
              { emoji: '→', label: '', color: '' },
              { emoji: '🎯', label: 'Orchestrator', color: 'bg-primary' },
              { emoji: '→', label: '', color: '' },
              { emoji: '📖', label: 'Story Agent', color: 'bg-accent' },
              { emoji: '🛡️', label: 'Safety Agent', color: 'bg-success' },
              { emoji: '📚', label: 'Education Agent', color: 'bg-secondary' },
              { emoji: '🎤', label: 'Voice Agent', color: 'bg-primary' },
              { emoji: '→', label: '', color: '' },
              { emoji: '✨', label: 'Magic Experience', color: 'bg-gold' },
            ].map((item, i) => (
              item.label ? (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={`p-4 rounded-2xl ${item.color} text-center min-w-[100px]`}
                >
                  <span className="text-kid-2xl block mb-1">{item.emoji}</span>
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                </motion.div>
              ) : (
                <span key={i} className="text-kid-xl text-muted-foreground">{item.emoji}</span>
              )
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

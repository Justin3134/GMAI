import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

const STATUS_ICONS = {
  pending: Clock,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const STATUS_COLORS = {
  pending: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-accent',
  error: 'text-danger',
};

export function AgentActivityFeed() {
  const agentDecisions = useGameStore((state) => state.agentDecisions);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card-game h-full overflow-hidden flex flex-col"
    >
      <h3 className="text-kid font-bold text-foreground mb-4 flex items-center gap-2">
        🤖 Agent Activity Feed
      </h3>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {agentDecisions.map((decision, index) => {
            const StatusIcon = STATUS_ICONS[decision.status];
            
            return (
              <motion.div
                key={`${decision.timestamp.getTime()}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-3 bg-muted rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <span className="text-kid-xl">{decision.agentEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {decision.agentName}:
                      </span>
                      <StatusIcon className={`w-4 h-4 ${STATUS_COLORS[decision.status]}`} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {decision.action}
                    </p>
                    {decision.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        📊 {decision.details}
                      </p>
                    )}
                    {decision.duration && (
                      <p className="text-xs text-muted-foreground">
                        ⏱️ {decision.duration}s
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {agentDecisions.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-kid">Waiting for activity...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

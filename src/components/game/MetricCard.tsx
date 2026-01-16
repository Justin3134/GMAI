import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  emoji?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, subtitle, emoji, trend }: MetricCardProps) {
  const trendColors = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-game"
    >
      <div className="flex items-center gap-3">
        {emoji && <span className="text-kid-2xl">{emoji}</span>}
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-kid-xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className={`text-sm ${trend ? trendColors[trend] : 'text-muted-foreground'}`}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

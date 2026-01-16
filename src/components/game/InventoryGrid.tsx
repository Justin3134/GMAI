import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function InventoryGrid() {
  const gameState = useGameStore((state) => state.gameState);

  if (!gameState) return null;

  const items = gameState.inventory;
  const emptySlots = Math.max(0, 6 - items.length);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card-game"
    >
      <h3 className="text-kid font-bold text-foreground mb-3 flex items-center gap-2">
        📦 Inventory
      </h3>
      
      <div className="grid grid-cols-3 gap-2">
        {items.map((item, index) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square bg-muted rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <span className="text-kid-2xl">{item.emoji}</span>
                {item.quantity > 1 && (
                  <span className="absolute bottom-1 right-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                    {item.quantity}
                  </span>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]">
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square bg-muted/50 rounded-xl border-2 border-dashed border-border"
          />
        ))}
      </div>
    </motion.div>
  );
}

import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon = '📭', 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-6xl"
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-600">{description}</p>
          </div>
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 mt-2"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

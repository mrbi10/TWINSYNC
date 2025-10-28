import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trophy, Award, Star, Crown, Zap } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface StreaksBadgesProps {
  streaks: {
    focus: number;
    hydration: number;
    breaks: number;
    sleep: number;
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress?: number;
    target?: number;
  }>;
  onStreakExtended?: () => void;
}

export function StreaksBadges({ streaks, badges, onStreakExtended }: StreaksBadgesProps) {
  const [selectedBadge, setSelectedBadge] = useState<typeof badges[0] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const streakItems = [
    { key: 'focus' as const, label: 'Focus', icon: Zap, color: 'from-violet-500 to-purple-500' },
    { key: 'hydration' as const, label: 'Hydration', icon: Flame, color: 'from-blue-500 to-cyan-500' },
    { key: 'breaks' as const, label: 'Breaks', icon: Flame, color: 'from-amber-500 to-orange-500' },
    { key: 'sleep' as const, label: 'Sleep', icon: Flame, color: 'from-indigo-500 to-blue-500' }
  ];

  const handleBadgeClick = (badge: typeof badges[0]) => {
    if (badge.unlocked) {
      setSelectedBadge(badge);
    }
  };

  return (
    <div className="space-y-6">
      {/* Streaks */}
      <div>
        <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">Current Streaks</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {streakItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${item.color} shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-5 h-5 text-white" />
                <motion.div
                  animate={{
                    scale: streaks[item.key] > 0 ? [1, 1.2, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: streaks[item.key] > 0 ? Infinity : 0
                  }}
                >
                  <Flame className="w-4 h-4 text-orange-300" />
                </motion.div>
              </div>
              <div className="text-2xl text-white mb-1">{streaks[item.key]}</div>
              <div className="text-xs text-white/80">{item.label}</div>
              <div className="text-xs text-white/60 mt-1">day streak</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div>
        <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">Achievement Badges</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {badges.map((badge, index) => (
            <motion.button
              key={badge.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
              whileHover={badge.unlocked ? { scale: 1.1 } : {}}
              whileTap={badge.unlocked ? { scale: 0.95 } : {}}
              onClick={() => handleBadgeClick(badge)}
              className={`relative p-4 rounded-2xl backdrop-blur-xl ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30'
                  : 'bg-slate-200/50 dark:bg-slate-700/50 border border-slate-300/50 dark:border-slate-600/50'
              } transition-all duration-300`}
            >
              {/* Badge Icon/Emoji */}
              <div className={`text-3xl mb-1 ${!badge.unlocked && 'grayscale opacity-40'}`}>
                {badge.icon}
              </div>

              {/* Badge Name */}
              <div className={`text-xs ${
                badge.unlocked ? 'text-white' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {badge.name}
              </div>

              {/* Progress Bar for locked badges */}
              {!badge.unlocked && badge.progress !== undefined && badge.target !== undefined && (
                <div className="mt-2">
                  <div className="w-full h-1 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(badge.progress / badge.target) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {badge.progress}/{badge.target}
                  </div>
                </div>
              )}

              {/* Unlock Animation */}
              {badge.unlocked && showConfetti && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Star className="w-8 h-8 text-yellow-300" fill="currentColor" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Badge Detail Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="backdrop-blur-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 border border-white/20 dark:border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-800 dark:text-white">
              {selectedBadge?.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Details about the {selectedBadge?.name} achievement badge
            </DialogDescription>
          </DialogHeader>
          {selectedBadge && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="text-8xl">{selectedBadge.icon}</div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                {selectedBadge.description}
              </p>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">Achievement Unlocked!</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from '../types';

interface AchievementsViewProps {
  badges: Badge[];
}

export function AchievementsView({ badges }: AchievementsViewProps) {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-2">Achievements & Badges</h2>
        <p className="text-muted-foreground mb-6">
          You've unlocked {unlockedCount} of {badges.length} badges
        </p>

        <div className="bg-gradient-to-r from-[var(--mint)] to-[var(--purple)] rounded-3xl p-6 text-white mb-6 shadow-lg">
          <div className="text-sm opacity-90 mb-1">Overall Progress</div>
          <div className="text-3xl mb-3">{Math.round((unlockedCount / badges.length) * 100)}%</div>
          <Progress value={(unlockedCount / badges.length) * 100} className="h-2 bg-white/20" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            className={`bg-card rounded-2xl p-6 shadow-sm border border-border ${
              !badge.unlocked && 'opacity-75'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={badge.unlocked ? { scale: 1.03, y: -4 } : {}}
          >
            <div className="relative mb-4">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-lg ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-[var(--mint)] to-[var(--purple)]'
                    : 'bg-muted'
                }`}
              >
                {badge.unlocked ? (
                  <span>{badge.icon}</span>
                ) : (
                  <Lock className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              {badge.unlocked && (
                <motion.div
                  className="absolute inset-0 rounded-full opacity-30 blur-xl"
                  style={{ background: 'linear-gradient(to bottom right, var(--mint), var(--purple))' }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>

            <h4 className="text-center mb-2">{badge.name}</h4>
            <p className="text-sm text-muted-foreground text-center mb-4">{badge.description}</p>

            {!badge.unlocked && (
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>
                    {badge.progress}/{badge.maxProgress}
                  </span>
                </div>
                <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-2" />
              </div>
            )}

            {badge.unlocked && (
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--success-green)', color: '#1f2937' }}>
                  Unlocked ✓
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

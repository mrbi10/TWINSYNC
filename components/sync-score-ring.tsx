import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SyncScoreRingProps {
  score: number;
  previousScore?: number;
  goals?: {
    water: { current: number; target: number };
    breaks: { current: number; target: number };
    focus: { current: number; target: number };
    sleep: { current: number; target: number };
  };
}

export function SyncScoreRing({ score, previousScore = 75, goals }: SyncScoreRingProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 85) return { gradient: 'from-emerald-500 to-green-500', text: 'Excellent', color: '#10b981' };
    if (score >= 70) return { gradient: 'from-blue-500 to-cyan-500', text: 'Good', color: '#3b82f6' };
    if (score >= 50) return { gradient: 'from-amber-500 to-yellow-500', text: 'Okay', color: '#f59e0b' };
    return { gradient: 'from-red-500 to-rose-500', text: 'Needs Attention', color: '#ef4444' };
  };

  const scoreConfig = getScoreColor();
  const trend = score > previousScore ? 'up' : score < previousScore ? 'down' : 'stable';
  const trendChange = Math.abs(score - previousScore);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        {/* SVG Ring */}
        <svg className="w-56 h-56 transform -rotate-90">
          {/* Background ring */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-slate-200 dark:text-slate-700"
          />
          
          {/* Progress ring */}
          <motion.circle
            cx="112"
            cy="112"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scoreConfig.color} stopOpacity="1" />
              <stop offset="100%" stopColor={scoreConfig.color} stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className={`text-5xl bg-gradient-to-br ${scoreConfig.gradient} bg-clip-text text-transparent mb-1`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {score}
          </motion.div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Sync Score</div>
          <div className={`text-xs bg-gradient-to-r ${scoreConfig.gradient} bg-clip-text text-transparent`}>
            {scoreConfig.text}
          </div>
        </div>

        {/* Trend indicator */}
        {trend !== 'stable' && (
          <motion.div
            className={`absolute -top-2 right-4 px-2 py-1 rounded-full backdrop-blur-xl ${
              trend === 'up' ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-xs ${
                trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {trendChange}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Remaining goals */}
      {goals && (
        <motion.div
          className="mt-6 p-4 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Today's Goals</div>
          <div className="space-y-1.5">
            {goals.water.current < goals.water.target && (
              <div className="text-xs text-slate-600 dark:text-slate-300">
                💧 {(goals.water.target - goals.water.current).toFixed(1)}L more to go
              </div>
            )}
            {goals.breaks.current < goals.breaks.target && (
              <div className="text-xs text-slate-600 dark:text-slate-300">
                ☕ {goals.breaks.target - goals.breaks.current} more breaks needed
              </div>
            )}
            {goals.focus.current < goals.focus.target && (
              <div className="text-xs text-slate-600 dark:text-slate-300">
                🎯 {(goals.focus.target - goals.focus.current).toFixed(1)}h focus remaining
              </div>
            )}
            {goals.sleep.current < goals.sleep.target && (
              <div className="text-xs text-slate-600 dark:text-slate-300">
                🌙 {(goals.sleep.target - goals.sleep.current).toFixed(1)}h sleep target
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

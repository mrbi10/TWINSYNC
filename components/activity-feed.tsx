import { motion, AnimatePresence } from 'motion/react';
import { Droplet, Coffee, Smile, Target, Moon, Flame, Trophy, TrendingUp } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'hydration' | 'break' | 'mood' | 'focus' | 'sleep' | 'streak' | 'badge' | 'progress';
  label: string;
  timestamp: string;
  isMilestone?: boolean;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    const icons = {
      hydration: Droplet,
      break: Coffee,
      mood: Smile,
      focus: Target,
      sleep: Moon,
      streak: Flame,
      badge: Trophy,
      progress: TrendingUp
    };
    return icons[type];
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    const colors = {
      hydration: 'from-blue-500 to-cyan-500',
      break: 'from-amber-500 to-orange-500',
      mood: 'from-pink-500 to-rose-500',
      focus: 'from-violet-500 to-purple-500',
      sleep: 'from-indigo-500 to-blue-500',
      streak: 'from-orange-500 to-red-500',
      badge: 'from-yellow-500 to-orange-500',
      progress: 'from-emerald-500 to-green-500'
    };
    return colors[type];
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-slate-600 dark:text-slate-300">Activity Feed</h3>
        <div className="text-xs text-slate-500 dark:text-slate-400">Last {maxItems} activities</div>
      </div>

      <div className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 overflow-hidden h-full">
        <div className="h-full overflow-y-auto">
          <AnimatePresence initial={false}>
            {displayActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const gradient = getActivityColor(activity.type);

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors ${
                    activity.isMilestone ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' : ''
                  }`}
                >
                  {/* Icon */}
                  <motion.div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring' }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-800 dark:text-white truncate">
                      {activity.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>

                  {/* Milestone indicator */}
                  {activity.isMilestone && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {displayActivities.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-slate-400 dark:text-slate-500 text-sm">
              No activities yet. Start logging your habits!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

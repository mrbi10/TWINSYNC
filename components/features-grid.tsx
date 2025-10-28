import { motion } from 'motion/react';
import { Timer, Trophy, Smile, Moon, Droplet, Utensils, Activity, Calendar } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  onClick: () => void;
}

interface FeaturesGridProps {
  onNavigate: (screen: string) => void;
}

export function FeaturesGrid({ onNavigate }: FeaturesGridProps) {
  const features: Feature[] = [
    {
      id: 'focus',
      name: 'Focus Timer',
      icon: Timer,
      color: 'text-violet-600 dark:text-violet-400',
      gradient: 'from-violet-500/20 to-purple-500/20',
      onClick: () => onNavigate('focus')
    },
    {
      id: 'achievements',
      name: 'Achievements',
      icon: Trophy,
      color: 'text-yellow-600 dark:text-yellow-400',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      onClick: () => onNavigate('achievements')
    },
    {
      id: 'mood',
      name: 'Mood Tracker',
      icon: Smile,
      color: 'text-pink-600 dark:text-pink-400',
      gradient: 'from-pink-500/20 to-rose-500/20',
      onClick: () => onNavigate('mood')
    },
    {
      id: 'sleep',
      name: 'Sleep Tracker',
      icon: Moon,
      color: 'text-indigo-600 dark:text-indigo-400',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      onClick: () => onNavigate('sleep')
    },
    {
      id: 'water',
      name: 'Water Tracker',
      icon: Droplet,
      color: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      onClick: () => onNavigate('water')
    },
    {
      id: 'food',
      name: 'Food Log',
      icon: Utensils,
      color: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500/20 to-green-500/20',
      onClick: () => onNavigate('food-log')
    },
    {
      id: 'heatmap',
      name: 'Habit Heatmap',
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500/20 to-fuchsia-500/20',
      onClick: () => onNavigate('habit-heatmap')
    },
    {
      id: 'activity',
      name: 'Activity Log',
      icon: Activity,
      color: 'text-teal-600 dark:text-teal-400',
      gradient: 'from-teal-500/20 to-cyan-500/20',
      onClick: () => onNavigate('activity-log')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <div className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-2xl">
        <div className="mb-6">
          <h3 className="text-xl text-slate-800 dark:text-white mb-1">Quick Access Features</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Track your wellness journey with these tools</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={feature.onClick}
                className={`group relative overflow-hidden flex flex-col items-center gap-3 p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${feature.gradient} border border-white/30 dark:border-slate-700/30 hover:scale-105 hover:shadow-lg transition-all duration-300`}
              >
                {/* Sliding glow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                
                <div className={`relative z-10 w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-700/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                
                <span className="relative z-10 text-xs text-center text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {feature.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

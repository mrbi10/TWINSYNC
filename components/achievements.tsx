import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Trophy, Lock, Star, Zap, Target, Award, Crown, Medal } from 'lucide-react';
import { Progress } from './ui/progress';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'focus' | 'wellness' | 'consistency' | 'milestones';
  target: number;
  current: number;
  unlocked: boolean;
  unlockedDate?: string;
  reward: string;
}

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('twinsync_achievements');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return [
      // Focus Achievements
      {
        id: 'first-focus',
        name: 'First Focus',
        description: 'Complete your first focus session',
        icon: '🎯',
        category: 'focus',
        target: 1,
        current: 0,
        unlocked: false,
        reward: '+10 points'
      },
      {
        id: 'focus-warrior',
        name: 'Focus Warrior',
        description: 'Complete 10 focus sessions',
        icon: '⚡',
        category: 'focus',
        target: 10,
        current: 0,
        unlocked: false,
        reward: '+50 points'
      },
      {
        id: 'focus-master',
        name: 'Focus Master',
        description: 'Complete 50 focus sessions',
        icon: '🏆',
        category: 'focus',
        target: 50,
        current: 0,
        unlocked: false,
        reward: '+200 points'
      },
      {
        id: 'deep-work',
        name: 'Deep Work Champion',
        description: 'Accumulate 100 hours of focus time',
        icon: '🧠',
        category: 'focus',
        target: 360000, // 100 hours in seconds
        current: 0,
        unlocked: false,
        reward: '+500 points'
      },
      
      // Wellness Achievements
      {
        id: 'hydration-hero',
        name: 'Hydration Hero',
        description: 'Log water intake for 7 consecutive days',
        icon: '💧',
        category: 'wellness',
        target: 7,
        current: 0,
        unlocked: false,
        reward: '+30 points'
      },
      {
        id: 'sleep-guardian',
        name: 'Sleep Guardian',
        description: 'Maintain 7-9 hours of sleep for 14 days',
        icon: '🌙',
        category: 'wellness',
        target: 14,
        current: 0,
        unlocked: false,
        reward: '+100 points'
      },
      {
        id: 'wellness-warrior',
        name: 'Wellness Warrior',
        description: 'Complete all daily wellness goals for 30 days',
        icon: '💪',
        category: 'wellness',
        target: 30,
        current: 0,
        unlocked: false,
        reward: '+250 points'
      },
      {
        id: 'nutrition-ninja',
        name: 'Nutrition Ninja',
        description: 'Log balanced meals for 21 consecutive days',
        icon: '🥗',
        category: 'wellness',
        target: 21,
        current: 0,
        unlocked: false,
        reward: '+150 points'
      },
      
      // Consistency Achievements
      {
        id: 'week-streak',
        name: 'Week Warrior',
        description: 'Log activities for 7 consecutive days',
        icon: '🔥',
        category: 'consistency',
        target: 7,
        current: 0,
        unlocked: false,
        reward: '+40 points'
      },
      {
        id: 'month-master',
        name: 'Month Master',
        description: 'Log activities for 30 consecutive days',
        icon: '📅',
        category: 'consistency',
        target: 30,
        current: 0,
        unlocked: false,
        reward: '+200 points'
      },
      {
        id: 'consistency-king',
        name: 'Consistency King',
        description: 'Log activities for 100 consecutive days',
        icon: '👑',
        category: 'consistency',
        target: 100,
        current: 0,
        unlocked: false,
        reward: '+1000 points'
      },
      
      // Milestone Achievements
      {
        id: 'health-score-80',
        name: 'Healthy Living',
        description: 'Achieve a health score of 80 or above',
        icon: '⭐',
        category: 'milestones',
        target: 80,
        current: 0,
        unlocked: false,
        reward: '+100 points'
      },
      {
        id: 'health-score-90',
        name: 'Peak Performance',
        description: 'Achieve a health score of 90 or above',
        icon: '🌟',
        category: 'milestones',
        target: 90,
        current: 0,
        unlocked: false,
        reward: '+250 points'
      },
      {
        id: 'perfect-week',
        name: 'Perfect Week',
        description: 'Complete all goals for an entire week',
        icon: '💎',
        category: 'milestones',
        target: 7,
        current: 0,
        unlocked: false,
        reward: '+150 points'
      },
      {
        id: 'ten-thousand-steps',
        name: '10K Steps Club',
        description: 'Walk 10,000 steps in a single day',
        icon: '👟',
        category: 'milestones',
        target: 10000,
        current: 0,
        unlocked: false,
        reward: '+50 points'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('twinsync_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const categories = [
    { id: 'focus', name: 'Focus', icon: Zap, color: 'violet' },
    { id: 'wellness', name: 'Wellness', icon: Star, color: 'emerald' },
    { id: 'consistency', name: 'Consistency', icon: Target, color: 'orange' },
    { id: 'milestones', name: 'Milestones', icon: Crown, color: 'blue' }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + parseInt(a.reward.replace(/[^\d]/g, '')), 0);

  const getCategoryColor = (category: string) => {
    const colors = {
      focus: 'from-violet-500/20 to-purple-500/20 border-violet-500/30',
      wellness: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
      consistency: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
      milestones: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
    };
    return colors[category as keyof typeof colors];
  };

  const getCategoryIconColor = (category: string) => {
    const colors = {
      focus: 'text-violet-600 dark:text-violet-400',
      wellness: 'text-emerald-600 dark:text-emerald-400',
      consistency: 'text-orange-600 dark:text-orange-400',
      milestones: 'text-blue-600 dark:text-blue-400'
    };
    return colors[category as keyof typeof colors];
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl text-slate-800 dark:text-white mb-1">Achievements</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your progress and unlock rewards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <div className="text-2xl text-slate-800 dark:text-white mb-1">
              {unlockedCount}/{achievements.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Unlocked</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
            <div className="text-2xl text-slate-800 dark:text-white mb-1">{totalPoints}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Total Points</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <div className="text-2xl text-slate-800 dark:text-white mb-1">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Complete</div>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      {categories.map((category, catIndex) => {
        const categoryAchievements = achievements.filter(a => a.category === category.id);
        const Icon = category.icon;
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-5 h-5 ${getCategoryIconColor(category.id)}`} />
              <h2 className="text-xl text-slate-800 dark:text-white">{category.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                  className={`relative rounded-2xl backdrop-blur-xl bg-gradient-to-br ${getCategoryColor(achievement.category)} border p-6 shadow-lg ${
                    achievement.unlocked ? '' : 'opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-slate-800 dark:text-white mb-1">
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked ? (
                          <Award className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      {!achievement.unlocked && (
                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>Progress</span>
                            <span>{achievement.current} / {achievement.target}</span>
                          </div>
                          <Progress 
                            value={(achievement.current / achievement.target) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}

                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                          ✓ Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </div>
                      )}

                      <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/50 dark:bg-slate-700/50 text-xs text-slate-700 dark:text-slate-300">
                        {achievement.reward}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

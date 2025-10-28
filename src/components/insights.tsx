import { motion } from 'motion/react';
import { Target, Moon, Droplet, Award, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { insightsData } from '../data/mock-data';

export function Insights() {
  const radarData = [
    { category: 'Focus', thisWeek: 85, lastWeek: 70, fullMark: 100 },
    { category: 'Sleep', thisWeek: 90, lastWeek: 82, fullMark: 100 },
    { category: 'Hydration', thisWeek: 75, lastWeek: 68, fullMark: 100 },
    { category: 'Breaks', thisWeek: 80, lastWeek: 65, fullMark: 100 },
    { category: 'Balance', thisWeek: 78, lastWeek: 72, fullMark: 100 }
  ];

  const comparisonData = [
    {
      metric: 'Focus Hours',
      thisWeek: insightsData.weeklyComparison.thisWeek.focus,
      lastWeek: insightsData.weeklyComparison.lastWeek.focus
    },
    {
      metric: 'Sleep Hours',
      thisWeek: insightsData.weeklyComparison.thisWeek.sleep,
      lastWeek: insightsData.weeklyComparison.lastWeek.sleep
    },
    {
      metric: 'Breaks',
      thisWeek: insightsData.weeklyComparison.thisWeek.breaks,
      lastWeek: insightsData.weeklyComparison.lastWeek.breaks
    },
    {
      metric: 'Water Glasses',
      thisWeek: insightsData.weeklyComparison.thisWeek.hydration,
      lastWeek: insightsData.weeklyComparison.lastWeek.hydration
    }
  ];

  const iconMap: Record<string, any> = {
    target: Target,
    moon: Moon,
    droplet: Droplet,
    award: Award
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl text-slate-800 dark:text-white mb-2">Your Insights</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Historical patterns and achievements</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-sm text-violet-700 dark:text-violet-300">
              This Week
            </button>
            <button className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm text-slate-600 dark:text-slate-300">
              This Month
            </button>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Recent Achievements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insightsData.achievements.map((achievement, index) => {
            const Icon = iconMap[achievement.icon];
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-sm text-slate-800 dark:text-white mb-1">{achievement.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Weekly Performance Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Weekly Performance</h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <defs>
              <linearGradient id="radarThis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="radarLast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="#e2e8f0" opacity={0.3} />
            <PolarAngleAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
            <PolarRadiusAxis stroke="#94a3b8" fontSize={12} />
            <Radar name="This Week" dataKey="thisWeek" stroke="#8b5cf6" fill="url(#radarThis)" strokeWidth={2} />
            <Radar name="Last Week" dataKey="lastWeek" stroke="#94a3b8" fill="url(#radarLast)" strokeWidth={2} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '14px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Week-over-Week Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Week Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <defs>
              <linearGradient id="thisWeekGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="lastWeekGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                border: 'none', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
            <Bar dataKey="thisWeek" name="This Week" fill="url(#thisWeekGradient)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="lastWeek" name="Last Week" fill="url(#lastWeekGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Best Streak',
            value: '7 days',
            subtitle: 'Sleep consistency',
            gradient: 'from-indigo-500 to-blue-500'
          },
          {
            title: 'Most Improved',
            value: '+12.6%',
            subtitle: 'Focus hours',
            gradient: 'from-violet-500 to-purple-500'
          },
          {
            title: 'Overall Score',
            value: '82/100',
            subtitle: 'Health balance',
            gradient: 'from-emerald-500 to-green-500'
          }
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-2xl"
          >
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{card.title}</div>
            <div className={`text-3xl bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent mb-1`}>
              {card.value}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">{card.subtitle}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

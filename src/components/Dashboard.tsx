import { motion } from 'motion/react';
import { HealthScore } from './health-score';
import { HabitHeatmap } from './habit-heatmap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { 
  mockUserData, 
  weeklyHydrationData, 
  weeklyFocusData, 
  weeklySleepData, 
  weeklyScreenTimeData,
  habitHeatmapData,
  twinFeedback 
} from '../data/mock-data';

export function Dashboard() {
  return (
    <div className="space-y-6 pb-8">
      {/* Today's Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl text-slate-800 dark:text-white mb-2">Today's Overview</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tuesday, October 28, 2025</p>
          </div>
          <div className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
            <span className="text-sm text-violet-700 dark:text-violet-300">Week 43</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center">
            <HealthScore score={mockUserData.healthScore} />
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-300 text-center max-w-xs">
              Your overall wellness score based on focus, hydration, sleep, and activity balance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Focus Hours', value: mockUserData.today.focusHours, unit: 'h', color: 'violet', target: '6h goal' },
              { label: 'Hydration', value: mockUserData.today.waterGlasses, unit: '/8', color: 'blue', target: '8 glasses' },
              { label: 'Sleep', value: mockUserData.today.sleepHours, unit: 'h', color: 'indigo', target: '8h goal' },
              { label: 'Breaks Taken', value: mockUserData.today.breaks, unit: '', color: 'amber', target: '5 target' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30"
              >
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{stat.label}</div>
                <div className={`text-3xl bg-gradient-to-br from-${stat.color}-600 to-${stat.color}-400 bg-clip-text text-transparent mb-1`}>
                  {stat.value}{stat.unit}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">{stat.target}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Habit Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Streaks</h3>
        </div>
        {/* <HabitHeatmap data={habitHeatmapData} streaks={mockUserData.streaks} /> */}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-2xl"
        >
          <h4 className="text-sm text-slate-600 dark:text-slate-300 mb-4">Weekly Hydration</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyHydrationData}>
              <defs>
                <linearGradient id="hydrationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar dataKey="glasses" fill="url(#hydrationGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Focus Hours Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-2xl"
        >
          <h4 className="text-sm text-slate-600 dark:text-slate-300 mb-4">Weekly Focus Hours</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyFocusData}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2} fill="url(#focusGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sleep Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-2xl"
        >
          <h4 className="text-sm text-slate-600 dark:text-slate-300 mb-4">Sleep Duration</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklySleepData}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2} fill="url(#sleepGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Screen Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-2xl"
        >
          <h4 className="text-sm text-slate-600 dark:text-slate-300 mb-4">Screen Time</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyScreenTimeData}>
              <defs>
                <linearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area type="monotone" dataKey="hours" stroke="#f59e0b" strokeWidth={2} fill="url(#screenGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Twin Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Twin Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {twinFeedback.map((feedback, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30 flex items-start gap-3"
            >
              {feedback.type === 'positive' && <TrendingUp className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />}
              {feedback.type === 'suggestion' && <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
              {feedback.type === 'neutral' && <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />}
              <p className="text-sm text-slate-700 dark:text-slate-200">{feedback.message}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

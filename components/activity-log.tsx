import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Calendar, Award, Target, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LogEntry {
  date: string;
  activities: number;
  timestamp: string;
}

export function ActivityLog() {
  const [logHistory, setLogHistory] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('twinsync_activity_log');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate statistics
  const totalLogs = logHistory.length;
  const last7Days = logHistory.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  }).length;

  const getCurrentStreak = () => {
    if (logHistory.length === 0) return 0;
    
    const sortedLogs = [...logHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = getCurrentStreak();

  // Generate chart data for last 30 days
  const getChartData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const logsForDay = logHistory.filter(log => log.date === dateStr).length;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        logs: logsForDay
      });
    }
    return data;
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl text-slate-800 dark:text-white mb-1">Activity Log</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your logging habits and consistency
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Total Logs</span>
            </div>
            <div className="text-2xl text-slate-800 dark:text-white">{totalLogs}</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Current Streak</span>
            </div>
            <div className="text-2xl text-slate-800 dark:text-white">{currentStreak} days</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Last 7 Days</span>
            </div>
            <div className="text-2xl text-slate-800 dark:text-white">{last7Days} logs</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Avg/Week</span>
            </div>
            <div className="text-2xl text-slate-800 dark:text-white">
              {totalLogs > 0 ? Math.round((last7Days / 7) * 7) : 0}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <h3 className="text-xl text-slate-800 dark:text-white mb-6">30-Day Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="logs" 
              stroke="#14b8a6" 
              strokeWidth={2}
              fill="url(#activityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Why Log Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <h3 className="text-xl text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          Why Log Activity Regularly?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="text-sm text-slate-800 dark:text-white mb-1">Track Progress</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Regular logging helps you visualize your wellness journey and identify patterns
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="text-sm text-slate-800 dark:text-white mb-1">Build Consistency</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Daily logging builds healthy habits and keeps you accountable to your goals
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
            <div className="text-2xl mb-2">💡</div>
            <h4 className="text-sm text-slate-800 dark:text-white mb-1">Gain Insights</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your data reveals correlations between activities and your overall well-being
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="text-sm text-slate-800 dark:text-white mb-1">Unlock Achievements</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Consistent logging unlocks badges and rewards, making wellness more engaging
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            <strong>💪 Pro Tip:</strong> Try to log at least once daily for 7 days to establish a strong habit. Studies show it takes 21 days to form a lasting routine!
          </p>
        </div>
      </motion.div>
    </div>
  );
}

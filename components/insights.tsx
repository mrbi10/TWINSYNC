import { motion, AnimatePresence } from 'motion/react';
import { Target, Moon, Droplet, Award, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line } from 'recharts';
import { insightsData } from '../data/mock-data';
import { useState, useMemo } from 'react';
import { ProgressHistory } from '../App';

interface InsightsProps {
  progressHistory: ProgressHistory;
}

export function Insights({ progressHistory }: InsightsProps) {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');

  // Calculate daily comparison data from progress history
  const dailyComparisonData = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      
      const progress = progressHistory[dateStr];
      
      last7Days.push({
        day: dayName,
        date: dateStr,
        focus: progress ? (progress.workHours + progress.learningHours) : 0,
        sleep: progress?.sleepHours || 0,
        water: progress?.waterIntake || 0,
        steps: progress?.steps || 0
      });
    }
    
    return last7Days;
  }, [progressHistory]);

  // Calculate best streak
  const bestStreak = useMemo(() => {
    const dates = Object.keys(progressHistory).sort();
    let maxStreak = 0;
    let currentStreak = 0;
    let streakType = '';
    
    // Check sleep streak (7+ hours)
    let sleepStreak = 0;
    for (const date of dates) {
      if (progressHistory[date].sleepHours >= 7) {
        sleepStreak++;
        if (sleepStreak > maxStreak) {
          maxStreak = sleepStreak;
          streakType = 'Sleep consistency';
        }
      } else {
        sleepStreak = 0;
      }
    }
    
    // Check hydration streak (2.5L+)
    let hydrationStreak = 0;
    for (const date of dates) {
      if (progressHistory[date].waterIntake >= 2.5) {
        hydrationStreak++;
        if (hydrationStreak > maxStreak) {
          maxStreak = hydrationStreak;
          streakType = 'Hydration';
        }
      } else {
        hydrationStreak = 0;
      }
    }
    
    return { days: maxStreak, type: streakType };
  }, [progressHistory]);

  // Calculate most improved metric
  const mostImproved = useMemo(() => {
    const dates = Object.keys(progressHistory).sort();
    if (dates.length < 2) return { metric: 'Not enough data', percentage: 0 };
    
    const recentDates = dates.slice(-7);
    const olderDates = dates.slice(-14, -7);
    
    if (olderDates.length === 0) return { metric: 'Not enough data', percentage: 0 };
    
    // Calculate averages
    const calcAvg = (dateList: string[], key: keyof typeof progressHistory[string]) => {
      if (key === 'workHours' || key === 'learningHours') {
        return dateList.reduce((sum, d) => {
          const p = progressHistory[d];
          return sum + ((p?.workHours || 0) + (p?.learningHours || 0));
        }, 0) / dateList.length;
      }
      return dateList.reduce((sum, d) => sum + (progressHistory[d]?.[key] as number || 0), 0) / dateList.length;
    };
    
    const recentFocus = calcAvg(recentDates, 'workHours');
    const olderFocus = calcAvg(olderDates, 'workHours');
    const focusImprovement = olderFocus > 0 ? ((recentFocus - olderFocus) / olderFocus) * 100 : 0;
    
    const recentSleep = calcAvg(recentDates, 'sleepHours');
    const olderSleep = calcAvg(olderDates, 'sleepHours');
    const sleepImprovement = olderSleep > 0 ? ((recentSleep - olderSleep) / olderSleep) * 100 : 0;
    
    const recentWater = calcAvg(recentDates, 'waterIntake');
    const olderWater = calcAvg(olderDates, 'waterIntake');
    const waterImprovement = olderWater > 0 ? ((recentWater - olderWater) / olderWater) * 100 : 0;
    
    const improvements = [
      { metric: 'Focus hours', percentage: focusImprovement },
      { metric: 'Sleep', percentage: sleepImprovement },
      { metric: 'Hydration', percentage: waterImprovement }
    ];
    
    return improvements.reduce((max, curr) => curr.percentage > max.percentage ? curr : max);
  }, [progressHistory]);

  // Calculate overall score
  const overallScore = useMemo(() => {
    const dates = Object.keys(progressHistory).sort().slice(-7);
    if (dates.length === 0) return 0;
    
    const scores = dates.map(date => {
      const p = progressHistory[date];
      const waterScore = Math.min(25, (p.waterIntake / 2.5) * 25);
      const sleepScore = Math.min(25, (p.sleepHours / 8) * 25);
      const focusScore = Math.min(30, ((p.workHours + p.learningHours) / 8) * 30);
      const mealCount = [p.hadBreakfast, p.hadLunch, p.hadDinner].filter(Boolean).length;
      const mealScore = (mealCount / 3) * 10;
      const stepScore = Math.min(10, (p.steps / 10000) * 10);
      
      return waterScore + sleepScore + focusScore + mealScore + stepScore;
    });
    
    return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  }, [progressHistory]);

  const weeklyRadarData = [
    { category: 'Focus', thisWeek: 85, lastWeek: 70, fullMark: 100 },
    { category: 'Sleep', thisWeek: 90, lastWeek: 82, fullMark: 100 },
    { category: 'Hydration', thisWeek: 75, lastWeek: 68, fullMark: 100 },
    { category: 'Breaks', thisWeek: 80, lastWeek: 65, fullMark: 100 },
    { category: 'Balance', thisWeek: 78, lastWeek: 72, fullMark: 100 }
  ];

  const monthlyRadarData = [
    { category: 'Focus', thisWeek: 88, lastWeek: 75, fullMark: 100 },
    { category: 'Sleep', thisWeek: 92, lastWeek: 85, fullMark: 100 },
    { category: 'Hydration', thisWeek: 82, lastWeek: 73, fullMark: 100 },
    { category: 'Breaks', thisWeek: 85, lastWeek: 70, fullMark: 100 },
    { category: 'Balance', thisWeek: 86, lastWeek: 78, fullMark: 100 }
  ];

  const radarData = timePeriod === 'week' ? weeklyRadarData : monthlyRadarData;

  const weeklyComparisonData = [
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
      metric: 'Water (L)',
      thisWeek: insightsData.weeklyComparison.thisWeek.hydration,
      lastWeek: insightsData.weeklyComparison.lastWeek.hydration
    }
  ];

  const monthlyComparisonData = [
    { metric: 'Focus Hours', thisWeek: 135.2, lastWeek: 118.5 },
    { metric: 'Sleep Hours', thisWeek: 220.8, lastWeek: 205.0 },
    { metric: 'Breaks', thisWeek: 118, lastWeek: 95 },
    { metric: 'Water (L)', thisWeek: 72.5, lastWeek: 65.2 }
  ];

  const comparisonData = timePeriod === 'week' ? weeklyComparisonData : monthlyComparisonData;

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
            <button 
              onClick={() => setTimePeriod('week')}
              className={`px-4 py-2 rounded-2xl backdrop-blur-xl border text-sm transition-all duration-300 ${
                timePeriod === 'week'
                  ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-700 dark:text-violet-300'
                  : 'bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80'
              }`}
            >
              This Week
            </button>
            <button 
              onClick={() => setTimePeriod('month')}
              className={`px-4 py-2 rounded-2xl backdrop-blur-xl border text-sm transition-all duration-300 ${
                timePeriod === 'month'
                  ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-700 dark:text-violet-300'
                  : 'bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80'
              }`}
            >
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

      {/* Performance Radar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={timePeriod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-violet-500" />
            <h3 className="text-xl text-slate-800 dark:text-white">
              {timePeriod === 'week' ? 'Weekly' : 'Monthly'} Performance
            </h3>
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
              <Radar 
                name={timePeriod === 'week' ? 'This Week' : 'This Month'} 
                dataKey="thisWeek" 
                stroke="#8b5cf6" 
                fill="url(#radarThis)" 
                strokeWidth={2} 
              />
              <Radar 
                name={timePeriod === 'week' ? 'Last Week' : 'Last Month'} 
                dataKey="lastWeek" 
                stroke="#94a3b8" 
                fill="url(#radarLast)" 
                strokeWidth={2} 
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Daily Comparison Chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`daily-comparison`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-violet-500" />
            <h3 className="text-xl text-slate-800 dark:text-white">
              Daily Comparison
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyComparisonData}>
              <defs>
                <linearGradient id="focusLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="sleepLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="waterLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.5} />
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
              <Legend />
              <Line 
                type="monotone"
                dataKey="focus" 
                name="Focus (hours)" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone"
                dataKey="sleep" 
                name="Sleep (hours)" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone"
                dataKey="water" 
                name="Water (L)" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Best Streak',
            value: bestStreak.days > 0 ? `${bestStreak.days} days` : 'N/A',
            subtitle: bestStreak.type || 'No streaks yet',
            gradient: 'from-indigo-500 to-blue-500'
          },
          {
            title: 'Most Improved',
            value: mostImproved.percentage > 0 ? `+${mostImproved.percentage.toFixed(1)}%` : 'N/A',
            subtitle: mostImproved.metric,
            gradient: 'from-violet-500 to-purple-500'
          },
          {
            title: 'Overall Score',
            value: overallScore > 0 ? `${overallScore}/100` : 'N/A',
            subtitle: 'Health balance (7-day avg)',
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

import { motion } from 'motion/react';
import { Moon, TrendingUp, Clock, Star, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SleepEntry {
  date: string;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  quality: number;
  notes: string;
  timestamp: string;
}

export function SleepTracker() {
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>(() => {
    const saved = localStorage.getItem('twinsync_sleep_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [quality, setQuality] = useState([5]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('twinsync_sleep_history', JSON.stringify(sleepHistory));
  }, [sleepHistory]);

  const handleLogSleep = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    if (h === 0 && m === 0 && s === 0) {
      toast.error('Please enter valid sleep duration');
      return;
    }

    const totalSeconds = h * 3600 + m * 60 + s;
    const today = new Date().toISOString().split('T')[0];

    const entry: SleepEntry = {
      date: today,
      hours: h,
      minutes: m,
      seconds: s,
      totalSeconds,
      quality: quality[0],
      notes,
      timestamp: new Date().toISOString()
    };

    setSleepHistory(prev => {
      const filtered = prev.filter(e => e.date !== today);
      return [...filtered, entry].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    setHours('');
    setMinutes('');
    setSeconds('');
    setQuality([5]);
    setNotes('');
    
    toast.success('💤 Sleep logged successfully!');
  };

  // Calculate statistics
  const getStats = () => {
    if (sleepHistory.length === 0) {
      return {
        avgSleep: 0,
        avgQuality: 0,
        bestSleep: null,
        worstSleep: null,
        consistency: 0
      };
    }

    const totalSeconds = sleepHistory.reduce((sum, e) => sum + e.totalSeconds, 0);
    const avgSleep = totalSeconds / sleepHistory.length;
    
    const totalQuality = sleepHistory.reduce((sum, e) => sum + e.quality, 0);
    const avgQuality = totalQuality / sleepHistory.length;

    const sorted = [...sleepHistory].sort((a, b) => b.totalSeconds - a.totalSeconds);
    const bestSleep = sorted[0];
    const worstSleep = sorted[sorted.length - 1];

    // Calculate consistency (standard deviation)
    const mean = avgSleep;
    const variance = sleepHistory.reduce((sum, e) => 
      sum + Math.pow(e.totalSeconds - mean, 2), 0
    ) / sleepHistory.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, 100 - (stdDev / 3600) * 10);

    return { avgSleep, avgQuality, bestSleep, worstSleep, consistency };
  };

  const stats = getStats();

  // Get weekly pattern
  const getWeeklyPattern = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = sleepHistory.find(e => e.date === dateStr);
      
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: entry ? entry.totalSeconds / 3600 : 0,
        quality: entry ? entry.quality : 0,
        date: dateStr
      });
    }
    return weekData;
  };

  const weeklyPattern = getWeeklyPattern();

  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    
    if (h > 0) {
      return `${h}h ${m}m`;
    } else if (m > 0) {
      return `${m}m ${s}s`;
    }
    return `${s}s`;
  };

  const getSleepRecommendation = () => {
    if (stats.avgSleep === 0) {
      return {
        title: 'Start Tracking',
        message: 'Log your sleep to get personalized insights!',
        color: 'text-slate-600 dark:text-slate-400',
        icon: '💤'
      };
    }

    const avgHours = stats.avgSleep / 3600;
    
    if (avgHours < 6) {
      return {
        title: 'Sleep Deficit',
        message: 'You\'re not getting enough sleep. Aim for 7-9 hours per night.',
        color: 'text-red-600 dark:text-red-400',
        icon: '⚠️'
      };
    } else if (avgHours >= 7 && avgHours <= 9) {
      return {
        title: 'Optimal Sleep',
        message: 'Great! You\'re getting the recommended amount of sleep.',
        color: 'text-emerald-600 dark:text-emerald-400',
        icon: '✨'
      };
    } else if (avgHours > 9) {
      return {
        title: 'Oversleeping',
        message: 'Consider reducing sleep duration to 7-9 hours for optimal health.',
        color: 'text-amber-600 dark:text-amber-400',
        icon: '😴'
      };
    }
  };

  const recommendation = getSleepRecommendation();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl text-slate-800 dark:text-white mb-1">Sleep Tracker</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Monitor your sleep patterns and quality
        </p>
      </motion.div>

      {/* Log Sleep */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl text-slate-800 dark:text-white">Log Sleep</h3>
        </div>

        <div className="space-y-6">
          {/* Time Input */}
          <div>
            <Label className="mb-3 block">Sleep Duration</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours" className="text-xs text-slate-600 dark:text-slate-400">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0"
                  className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes" className="text-xs text-slate-600 dark:text-slate-400">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="0"
                  className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seconds" className="text-xs text-slate-600 dark:text-slate-400">Seconds</Label>
                <Input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="0"
                  className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
                />
              </div>
            </div>
          </div>

          {/* Sleep Quality Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Sleep Quality</Label>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {quality[0]}/10 {quality[0] >= 8 ? '😴' : quality[0] >= 5 ? '😊' : '😓'}
              </span>
            </div>
            <Slider
              value={quality}
              onValueChange={setQuality}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any sleep issues or observations..."
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
            />
          </div>

          <Button
            onClick={handleLogSleep}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
          >
            Log Sleep
          </Button>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Avg Sleep</div>
          <div className="text-2xl text-indigo-600 dark:text-indigo-400">
            {formatDuration(stats.avgSleep)}
          </div>
        </div>

        <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Avg Quality</div>
          <div className="text-2xl text-emerald-600 dark:text-emerald-400">
            {stats.avgQuality.toFixed(1)}/10
          </div>
        </div>

        <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Best Sleep</div>
          <div className="text-2xl text-blue-600 dark:text-blue-400">
            {stats.bestSleep ? formatDuration(stats.bestSleep.totalSeconds) : 'N/A'}
          </div>
        </div>

        <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Consistency</div>
          <div className="text-2xl text-violet-600 dark:text-violet-400">
            {stats.consistency.toFixed(0)}%
          </div>
        </div>
      </motion.div>

      {/* Recommendation */}
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-700/60 dark:to-slate-700/40 border border-white/30 dark:border-slate-600/30"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">{recommendation.icon}</span>
            <div>
              <h4 className={`text-sm mb-1 ${recommendation.color}`}>{recommendation.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{recommendation.message}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekly Sleep Pattern */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Weekly Sleep Pattern</h3>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={weeklyPattern}>
            <defs>
              <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              stroke="#94a3b8" 
              fontSize={12}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
              formatter={(value: number) => [`${value.toFixed(1)}h`, 'Sleep Duration']}
            />
            <Area 
              type="monotone" 
              dataKey="hours" 
              stroke="#6366f1" 
              strokeWidth={3}
              fill="url(#sleepGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Optimal Sleep Range Indicator */}
        <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Recommended: 7-9 hours per night</span>
          </div>
        </div>
      </motion.div>

      {/* Sleep Cycle Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Sleep Insights & Tips</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="text-sm text-slate-700 dark:text-slate-200 mb-2">🌙 Sleep Cycles</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              A complete sleep cycle lasts ~90 minutes. Aim for 5-6 cycles (7.5-9 hours) for optimal rest.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <div className="text-sm text-slate-700 dark:text-slate-200 mb-2">⏰ Consistency Matters</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Going to bed and waking up at the same time daily improves sleep quality by 30-40%.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm text-slate-700 dark:text-slate-200">Common Sleep Issues & Solutions</h4>
          
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-slate-700 dark:text-slate-200 mb-1">Difficulty Falling Asleep</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  → Avoid screens 1h before bed, keep room cool (60-67°F), try meditation or reading
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-slate-700 dark:text-slate-200 mb-1">Waking Up Frequently</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  → Limit caffeine after 2pm, reduce alcohol, ensure dark & quiet environment
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-slate-700 dark:text-slate-200 mb-1">Feeling Tired Despite Sleep</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  → Check for sleep apnea, maintain consistent schedule, exercise regularly (not before bed)
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sleep Habits & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 p-6"
      >
        <h4 className="text-sm text-slate-700 dark:text-slate-200 mb-4">💤 Sleep Optimization Tips</h4>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• <strong>Maintain a schedule:</strong> Go to bed and wake up at the same time daily</li>
          <li>• <strong>Create a routine:</strong> Wind down 30-60 minutes before bed</li>
          <li>• <strong>Optimize environment:</strong> Dark, cool (60-67°F), and quiet room</li>
          <li>• <strong>Limit stimulants:</strong> No caffeine 6h before bed, no alcohol 3h before</li>
          <li>• <strong>Exercise regularly:</strong> 30min daily, but not within 3h of bedtime</li>
          <li>• <strong>Manage stress:</strong> Practice meditation, journaling, or deep breathing</li>
          <li>• <strong>Avoid long naps:</strong> Keep daytime naps under 30 minutes</li>
          <li>• <strong>Get sunlight:</strong> 15-30 minutes of morning sunlight helps regulate circadian rhythm</li>
        </ul>
      </motion.div>
    </div>
  );
}
